'use client';

import { type CSSProperties, type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { knowledgeFields } from './knowledge';

const evidenceClass = {
  'Mạnh': 'strong',
  'Vừa': 'moderate',
  'Hỗn hợp': 'mixed',
} as const;

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelRef = useRef<HTMLElement | null>(null);
  const field = knowledgeFields[activeIndex];

  useEffect(() => {
    const fromHash = knowledgeFields.findIndex((item) => `#${item.id}` === window.location.hash);
    if (fromHash >= 0) setActiveIndex(fromHash);
  }, []);

  const updateHash = (index: number) => {
    window.history.replaceState(null, '', `#${knowledgeFields[index].id}`);
  };

  const activate = (index: number, scroll = true) => {
    setActiveIndex(index);
    updateHash(index);
    if (scroll) {
      window.requestAnimationFrame(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        panelRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      });
    }
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % knowledgeFields.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + knowledgeFields.length) % knowledgeFields.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = knowledgeFields.length - 1;
    else return;

    event.preventDefault();
    activate(next);
    tabRefs.current[next]?.focus();
    tabRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const style = { '--field-accent': field.accent } as CSSProperties;

  return (
    <main style={style}>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Cổ Học Viện — trang chủ">
          <span className="brand-mark" aria-hidden="true">古</span>
          <span>
            <strong>Cổ Học Viện</strong>
            <small>Bản đồ tri thức thực chứng</small>
          </span>
        </a>
        <nav className="header-nav" aria-label="Điều hướng chính">
          <a href="#cac-linh-vuc">12 lĩnh vực</a>
          <a href="#ranh-gioi">Ranh giới khoa học</a>
        </nav>
        <div className="header-note"><span>12</span> lĩnh vực · hơn 10.000 năm</div>
      </header>

      <section className="intro" id="top">
        <p className="kicker">Một bảo tàng số về trí tuệ cổ đại</p>
        <h1>Những công nghệ<br />đã dựng nên thế giới.</h1>
        <div className="intro-bottom">
          <p>
            Tách lớp quan sát, thử nghiệm và kỹ nghệ khỏi phần huyền luận — để thấy
            người xưa đã đo bầu trời, chữa bệnh, dẫn nước và vượt đại dương ra sao.
          </p>
          <div className="evidence-legend" aria-label="Chú giải mức độ bằng chứng">
            <span><i className="dot strong" />Mạnh</span>
            <span><i className="dot moderate" />Vừa</span>
            <span><i className="dot mixed" />Hỗn hợp</span>
          </div>
        </div>
      </section>

      <nav className="tab-shell" id="cac-linh-vuc" aria-label="Các lĩnh vực tri thức cổ">
        <p className="swipe-hint" aria-hidden="true">Kéo ngang để xem đủ 12 tab →</p>
        <div className="tabs" role="tablist" aria-label="Chọn lĩnh vực">
          {knowledgeFields.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => { tabRefs.current[index] = node; }}
              id={`tab-${item.id}`}
              className={activeIndex === index ? 'tab active' : 'tab'}
              type="button"
              role="tab"
              aria-controls="field-panel"
              aria-selected={activeIndex === index}
              tabIndex={activeIndex === index ? 0 : -1}
              onClick={() => activate(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>{item.short}
            </button>
          ))}
        </div>
      </nav>

      <section
        ref={panelRef}
        key={field.id}
        className="field-experience"
        id="field-panel"
        role="tabpanel"
        aria-labelledby={`tab-${field.id}`}
      >
        <article className="field-card">
          <div className="field-copy">
            <div className="field-meta">
              <span className="field-number">{String(activeIndex + 1).padStart(2, '0')} / 12</span>
              <span className={`evidence-chip ${evidenceClass[field.evidence]}`}>
                <i className={`dot ${evidenceClass[field.evidence]}`} /> Bằng chứng {field.evidence.toLowerCase()}
              </span>
            </div>
            <p className="field-overline">{field.eyebrow}</p>
            <h2>{field.title}</h2>
            <p className="lead">{field.summary}</p>
            <dl className="quick-facts">
              {field.quickFacts.map((fact) => (
                <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>
              ))}
            </dl>
            <a className="jump-link" href="#nguyen-ly">Xem nguyên lý <span>↓</span></a>
          </div>

          <figure className="field-visual">
            <img
              src={field.image}
              alt={field.alt}
              style={{ objectPosition: field.imagePosition ?? 'center' }}
              loading={activeIndex === 0 ? 'eager' : 'lazy'}
            />
            <div className="image-wash" />
            <div className="visual-index" aria-hidden="true">{String(activeIndex + 1).padStart(2, '0')}</div>
            <div className="visual-guide">
              <span>Bạn đang nhìn thấy</span>
              <ol>
                {field.visualNotes.map((note, index) => <li key={note}><b>{index + 1}</b>{note}</li>)}
              </ol>
            </div>
            <figcaption>
              <span>{field.alt}</span>
              <a href={field.imageSource} target="_blank" rel="noreferrer">{field.credit} ↗</a>
            </figcaption>
          </figure>
        </article>

        <section className="principle section-frame" id="nguyen-ly">
          <div className="section-heading">
            <p className="kicker">Nguyên lý cốt lõi</p>
            <h3>{field.principleTitle}</h3>
          </div>
          <ol className="process">
            {field.process.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><strong>{step.title}</strong><p>{step.text}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="timeline-section section-frame">
          <div className="section-heading compact">
            <p className="kicker">Bốn điểm neo lịch sử</p>
            <h3>Tri thức không sinh ra ở một nơi.</h3>
          </div>
          <div className="timeline">
            {field.milestones.map((milestone, index) => (
              <article key={`${milestone.date}-${milestone.place}`}>
                <span className="timeline-dot">{index + 1}</span>
                <time>{milestone.date}</time>
                <h4>{milestone.place}</h4>
                <p>{milestone.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="assessment section-frame">
          <div className="evidence-panel">
            <p className="kicker">Khoa học hiện đại nói gì?</p>
            <div className="evidence-score">
              <span className={`score-ring ${evidenceClass[field.evidence]}`}><i /></span>
              <div><small>Mức bằng chứng</small><strong>{field.evidence}</strong></div>
            </div>
            <p>{field.evidenceNote}</p>
            {(field.id === 'y-duoc' || field.id === 'than-tam') && (
              <p className="care-note">Thông tin giáo dục, không thay thế chẩn đoán hoặc điều trị chuyên môn.</p>
            )}
          </div>
          <div className="legacy-panel">
            <div className="legacy-column positive">
              <p className="kicker">Còn dùng đến nay</p>
              <ul>{field.legacies.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="legacy-column caution">
              <p className="kicker">Giới hạn cần nhớ</p>
              <ul>{field.limits.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </section>

        <section className="source-strip section-frame" aria-labelledby="source-title">
          <div>
            <p className="kicker" id="source-title">Đọc sâu & kiểm chứng</p>
            <p>Nguồn được chọn để phân biệt lịch sử, thực hành đo được và diễn giải về sau.</p>
          </div>
          <ul>
            {field.sources.map((source) => (
              <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}<span>↗</span></a></li>
            ))}
          </ul>
        </section>

        <nav className="field-pager section-frame" aria-label="Chuyển lĩnh vực">
          <button type="button" onClick={() => activate((activeIndex - 1 + knowledgeFields.length) % knowledgeFields.length)}>
            <span>← Lĩnh vực trước</span>
            <strong>{knowledgeFields[(activeIndex - 1 + knowledgeFields.length) % knowledgeFields.length].title}</strong>
          </button>
          <span className="pager-count">{String(activeIndex + 1).padStart(2, '0')}<i />12</span>
          <button type="button" onClick={() => activate((activeIndex + 1) % knowledgeFields.length)}>
            <span>Lĩnh vực sau →</span>
            <strong>{knowledgeFields[(activeIndex + 1) % knowledgeFields.length].title}</strong>
          </button>
        </nav>
      </section>

      <section className="boundary" id="ranh-gioi">
        <div className="boundary-title">
          <p className="kicker">Ranh giới quan trọng</p>
          <h2>“Cổ xưa” không tự động có nghĩa là “khoa học”.</h2>
          <p>Một tri thức đáng tin khi mô tả rõ cách quan sát, cho phép kiểm tra và chấp nhận sửa sai.</p>
        </div>
        <div className="boundary-grid">
          <article className="boundary-card verified">
            <span>01</span><h3>Tái lập được</h3>
            <p>Đo bóng, tỷ lệ hình học, mômen lực, hợp kim, tưới trọng lực, chu kỳ thiên văn.</p>
          </article>
          <article className="boundary-card examine">
            <span>02</span><h3>Kiểm chứng từng phần</h3>
            <p>Dược liệu, châm cứu, thiền, yoga hay quản lý sinh thái phải xét từng phương pháp và bối cảnh.</p>
          </article>
          <article className="boundary-card reject">
            <span>03</span><h3>Không coi là dữ kiện</h3>
            <p>Điềm báo, số mệnh, chữa bách bệnh hoặc “năng lượng” chưa đo được không phải kết luận khoa học.</p>
          </article>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark" aria-hidden="true">古</span>
          <span><strong>Cổ Học Viện</strong><small>Bản đồ tri thức thực chứng</small></span>
        </a>
        <p>Tư liệu lịch sử cần được đọc cùng bằng chứng mới. Niên đại “≈” là xấp xỉ và có thể còn tranh luận.</p>
        <a className="to-top" href="#top">Lên đầu trang ↑</a>
      </footer>
    </main>
  );
}
