'use client';

import { useState } from 'react';
import styles from '@/app/[locale]/projects/page.module.css';

interface Project {
  id: number;
  title_tr: string;
  title_en: string;
  desc_tr: string;
  desc_en: string;
  image: string | null;
  images: string | null;
}

interface ProjectListProps {
  projects: Project[];
  locale: string;
}

export default function ProjectList({ projects, locale }: ProjectListProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);

  const isTr = locale === 'tr';

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setActiveLightboxImage(null);
  };

  const getAdditionalImages = (imagesStr: string | null): string[] => {
    if (!imagesStr) return [];
    return imagesStr.split(',').map(url => url.trim()).filter(url => url.length > 0);
  };

  return (
    <>
      <div className={styles.grid}>
        {projects.length === 0 ? (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
            {isTr ? 'Henüz proje eklenmemiş.' : 'No projects added yet.'}
          </p>
        ) : null}
        
        {projects.map((project, index) => (
          <div 
            key={project.id} 
            className={`glass-panel hover-lift animate-fade-in ${styles.card}`}
            style={{ 
              animationDelay: `${0.05 + (index * 0.02)}s`,
              cursor: 'pointer' 
            }}
            onClick={() => handleCardClick(project)}
          >
            <div className={styles.imagePlaceholder}>
              {project.image ? (
                <img src={project.image} alt="Proje" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                isTr ? `Görsel ${project.id}` : `Image ${project.id}`
              )}
            </div>
            <div className={styles.cardContent}>
              <h3>{isTr ? project.title_tr : project.title_en}</h3>
              <p className={styles.cardTextSummary}>{isTr ? project.desc_tr : project.desc_en}</p>
              <span style={{ 
                fontSize: '0.85rem', 
                color: 'var(--accent)', 
                fontWeight: 'bold', 
                marginTop: '1rem',
                display: 'inline-block' 
              }}>
                {isTr ? 'Detayları Gör →' : 'View Details →'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {selectedProject && (
        <div 
          onClick={handleCloseModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '2rem',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-panel"
            style={{
              maxWidth: '850px',
              width: '100%',
              backgroundColor: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '24px',
              padding: '2.5rem',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              color: 'var(--foreground)'
            }}
          >
            {/* Close Button */}
            <button 
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '1.2rem',
                right: '1.5rem',
                border: 'none',
                background: 'none',
                fontSize: '2rem',
                cursor: 'pointer',
                color: 'var(--primary)',
                lineHeight: 1,
                opacity: 0.7,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
            >
              &times;
            </button>

            {/* Modal Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Cover Image */}
              {selectedProject.image && (
                <div style={{ 
                  width: '100%', 
                  height: '350px', 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  border: '1px solid var(--border)' 
                }}>
                  <img 
                    src={selectedProject.image} 
                    alt="Proje Kapak" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
              )}

              {/* Title & Description */}
              <div>
                <h2 style={{ fontSize: '2.2rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                  {isTr ? selectedProject.title_tr : selectedProject.title_en}
                </h2>
                <div style={{ height: '4px', width: '80px', backgroundColor: 'var(--accent)', borderRadius: '2px', marginBottom: '1.5rem' }} />
                <div style={{ maxWidth: '720px', textAlign: 'left', marginTop: '1.5rem' }}>
                  {(isTr ? selectedProject.desc_tr : selectedProject.desc_en).split('\n').map((line, idx) => {
                    if (line.trim() === '') {
                      return <div key={idx} style={{ height: '1rem' }} />;
                    }
                    return (
                      <p key={idx} style={{ 
                        fontSize: '1.05rem', 
                        lineHeight: '1.85', 
                        color: 'var(--foreground)', 
                        marginBottom: '1rem',
                        opacity: 0.95
                      }}>
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Gallery Grid */}
              {getAdditionalImages(selectedProject.images).length > 0 && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                    {isTr ? 'Proje Fotoğraf Galerisi' : 'Project Photo Gallery'}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    {isTr ? '(Büyütmek için görsellere tıklayın)' : '(Click images to view fullscreen)'}
                  </p>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                    gap: '1rem' 
                  }}>
                    {getAdditionalImages(selectedProject.images).map((imgUrl, i) => (
                      <div 
                        key={i} 
                        onClick={() => setActiveLightboxImage(imgUrl)}
                        style={{ 
                          height: '110px', 
                          borderRadius: '12px', 
                          overflow: 'hidden', 
                          cursor: 'pointer',
                          border: '1px solid var(--border)',
                          transition: 'transform 0.2s, box-shadow 0.2s' 
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <img 
                          src={imgUrl} 
                          alt={`Galeri ${i}`} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Fullscreen Image Preview */}
      {activeLightboxImage && (
        <div 
          onClick={() => setActiveLightboxImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000,
            cursor: 'pointer',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <button 
            onClick={() => setActiveLightboxImage(null)}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '2rem',
              border: 'none',
              background: 'none',
              color: 'white',
              fontSize: '3rem',
              cursor: 'pointer'
            }}
          >
            &times;
          </button>
          <img 
            src={activeLightboxImage} 
            alt="Lightbox Preview" 
            style={{ 
              maxWidth: '92%', 
              maxHeight: '92%', 
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.8)' 
            }} 
          />
        </div>
      )}
    </>
  );
}
