import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Bot, X, Send, User } from 'lucide-react';
import styles from './AIChatbot.module.css';

export default function AIChatbot() {
  const t = useTranslations('Chatbot');
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { messages, sendMessage, status, error } = useChat();
  const isLoading = status === 'submitted' || status === 'streaming';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    if (sendMessage) {
      sendMessage({ role: 'user', parts: [{ type: 'text', text: inputValue }] });
    }
    setInputValue('');
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button 
        onClick={toggleChat}
        className={`${styles.toggleBtn} float-bounce ${isOpen ? styles.hidden : ''}`}
        aria-label="Yapay Zeka Asistanını Aç"
      >
        <Bot size={28} />
      </button>

      {/* Chat Window */}
      <div className={`${styles.chatWindow} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <Bot size={20} />
            <span>{t('title')}</span>
          </div>
          <button onClick={toggleChat} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.messagesContainer}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <Bot size={40} className={styles.emptyIcon} />
              <p>{t('greeting')}</p>
            </div>
          ) : (
            messages.map((m) => {
              const rawText = m.parts?.map((p: any) => p.type === 'text' ? p.text : '').join('') || '';
              const hasServicesLink = rawText.includes('[LINK_SERVICES]');
              const hasContactLink = rawText.includes('[LINK_CONTACT]');
              const displayContent = rawText
                .replace(/\[LINK_SERVICES\]/g, '')
                .replace(/\[LINK_CONTACT\]/g, '')
                .trim();

              return (
                <div
                  key={m.id}
                  className={`${styles.messageWrapper} ${
                    m.role === 'user' ? styles.messageUser : styles.messageBot
                  }`}
                >
                  <div className={styles.avatar}>
                    {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={styles.messageContent}>
                    {displayContent}
                    {hasServicesLink && (
                      <Link href="/services" className={styles.servicesButton}>
                        {t('servicesLink')}
                      </Link>
                    )}
                    {hasContactLink && (
                      <Link href="/contact" className={styles.servicesButton} style={{ marginLeft: hasServicesLink ? '10px' : '0' }}>
                        {t('contactLink')}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          )}
          {isLoading && (
            <div className={`${styles.messageWrapper} ${styles.messageBot}`}>
              <div className={styles.avatar}>
                <Bot size={14} />
              </div>
              <div className={styles.typingIndicator}>
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          )}
          {error && (
            <div style={{ padding: '0.8rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid #fca5a5' }}>
              <strong>Hata:</strong> {error.message || 'Bağlantı kurulamadı.'}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={onSubmit} className={styles.inputForm}>
          <input
            className={styles.inputField}
            value={inputValue}
            placeholder="Bize bir soru sorun..."
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className={styles.sendBtn}
            disabled={isLoading || !inputValue.trim()}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
}
