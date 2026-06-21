'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './FaqAccordion.module.css';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  title: string;
  desc: string;
  items: FaqItem[];
}

export default function FaqAccordion({ title, desc, items }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className={styles.faqSection}>
      <div className="container">
        <div className={styles.header}>
          <h2>{title}</h2>
          <p>{desc}</p>
        </div>

        <div className={styles.accordion}>
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div 
                key={item.id} 
                className={`glass-panel ${styles.item} ${isOpen ? styles.itemOpen : ''}`}
              >
                <button 
                  className={styles.questionButton}
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                
                <div className={`${styles.answerContainer} ${isOpen ? styles.answerContainerOpen : ''}`}>
                  <div className={styles.answerContent}>
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
