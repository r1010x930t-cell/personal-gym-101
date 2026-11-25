import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  Check,
  Sprout,
  Leaf,
  Heart,
  Sun,
  Menu,
  Clock3,
  CalendarDays,
  MapPin,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const images = {
  hero: "/images/hero-gym.webp",
  studio: "/images/studio-hero.webp",
  training: "/images/training.webp",
  still: "/images/still-life.webp",
  trainer: "/images/trainer.webp",
  trainer02: "/images/trainer-02.webp",
};
const nav = [
  ["コンセプト", "concept"],
  ["選ばれる理由", "features"],
  ["トレーナー", "trainer"],
  ["プログラム・料金", "plans"],
  ["よくあるご質問", "faq"],
  ["アクセス", "access"],
];
const faqs = [
  [
    "運動が苦手で、ジムも初めてですが大丈夫ですか？",
    "もちろんです。まずは今の体力や普段の過ごし方をお聞きし、無理のない動きから一緒に始めます。重い負荷を使うことよりも、気持ちよく身体を動かすことを大切にしています。",
  ],
  [
    "体験レッスンでは、どんなことをしますか？",
    "カウンセリング、簡単な動きのチェック、トレーニング体験、振り返りを行います。所要時間は約60分を想定しています。気になることや目指したい姿を、気軽にお話しください。",
  ],
  [
    "何を持っていけばいいですか？",
    "動きやすいウェアと室内用シューズをお持ちください。タオルとお水はスタジオでご用意する想定です。実際のレンタル内容は、店舗オープン時にご案内します。",
  ],
  [
    "食事制限は必要ですか？",
    "極端な制限ではなく、毎日の食事を大切にすることを基本としています。生活リズムや好みに合わせ、無理なく続けられる習慣を一緒に考えます。",
  ],
  [
    "どれくらいの頻度で通うのがおすすめですか？",
    "運動習慣をつけたい方には、まずは週1回のペースをご提案しています。お仕事や暮らしのリズムに合わせて調整できます。目標や体力によって適切な頻度は異なるため、体験時にご相談ください。",
  ],
];

function Logo({ footer = false }: { footer?: boolean }) {
  return (
    <a
      href="#top"
      className={`brand ${footer ? "brand-footer" : ""}`}
      aria-label="パーソナルジム101 ホーム"
    >
      <span className="brand-main">
        <Sprout strokeWidth={1.3} aria-hidden="true" />
        <span className="brand-name">
          <span className="brand-prefix">パーソナルジム</span>
          <span>101</span>
        </span>
      </span>
      <span className="brand-sub">PERSONAL TRAINING STUDIO</span>
    </a>
  );
}
function SectionLabel({
  children,
  number,
}: {
  children: React.ReactNode;
  number?: string;
}) {
  return (
    <div className="section-label">
      {number && <span className="section-number">{number}</span>}
      <span>{children}</span>
    </div>
  );
}
function BookingDialog({
  open,
  onOpenChange,
  initialPlan,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPlan: string;
}) {
  const [step, setStep] = useState<"form" | "review" | "done">("form");
  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    time: "午前（9:00〜12:00）",
  });
  const [error, setError] = useState("");
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  function close(value: boolean) {
    onOpenChange(value);
    if (!value) {
      setStep("form");
      setError("");
      setForm({ name: "", email: "", date: "", time: "午前（9:00〜12:00）" });
    }
  }
  function review(event: FormEvent) {
    event.preventDefault();
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.date ||
      form.date < minDate
    ) {
      setError("お名前・メールアドレス・本日以降の希望日をご確認ください。");
      return;
    }
    setError("");
    setStep("review");
  }
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="booking-dialog sm:max-w-[530px]">
        <DialogHeader>
          <span className="modal-eyebrow">YOUR FIRST STEP</span>
          <DialogTitle className="modal-title">
            {step === "done"
              ? "体験のイメージは、できましたか？"
              : step === "review"
                ? "ご希望内容の確認"
                : "小さな一歩を、ここから。"}
          </DialogTitle>
          <DialogDescription>
            体験レッスン 約60分・参考料金 3,300円（税込）
          </DialogDescription>
        </DialogHeader>
        <p className="demo-note">
          <Leaf size={15} />
          デモフォームです。入力内容は送信・保存されず、予約は成立しません。
        </p>
        {step === "form" ? (
          <form onSubmit={review} className="booking-form">
            <div className="selected-plan">
              ご希望のプラン <strong>{initialPlan}</strong>
            </div>
            <label>
              お名前 <span>必須</span>
              <input
                required
                autoComplete="name"
                placeholder="例：山田 はな"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                maxLength={80}
              />
            </label>
            <label>
              メールアドレス <span>必須</span>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                maxLength={254}
              />
            </label>
            <div className="form-row">
              <label>
                体験の希望日 <span>必須</span>
                <input
                  aria-label="体験の希望日"
                  type="date"
                  min={minDate}
                  required
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                />
              </label>
              <label>
                ご希望の時間帯
                <select
                  aria-label="ご希望の時間帯"
                  value={form.time}
                  onChange={e => setForm({ ...form, time: e.target.value })}
                >
                  <option>午前（9:00〜12:00）</option>
                  <option>午後（12:00〜17:00）</option>
                  <option>夕方以降（17:00〜21:00）</option>
                </select>
              </label>
            </div>
            <p className="form-help">
              日時は選択例です。実際の空き状況とは連動していません。デモのため、サンプル情報でお試しください。
            </p>
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            <button type="submit" className="pill-button full">
              入力内容を確認する
              <ArrowRight size={17} />
            </button>
          </form>
        ) : step === "review" ? (
          <div className="booking-review">
            <dl>
              {[
                ["お名前", form.name],
                ["メールアドレス", form.email],
                ["希望日", form.date],
                ["時間帯", form.time],
                ["プラン", initialPlan],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <p className="form-help">
              この内容が店舗へ送信されることはありません。
            </p>
            <button
              className="pill-button full"
              onClick={() => setStep("done")}
            >
              デモを完了する
              <Check size={17} />
            </button>
            <button className="back-button" onClick={() => setStep("form")}>
              入力内容を修正する
            </button>
          </div>
        ) : (
          <div className="booking-done">
            <div className="done-icon">
              <Sprout size={35} strokeWidth={1.2} />
            </div>
            <p>
              ご確認ありがとうございます。
              <br />
              こちらは予約フローのプレビューです。
              <br />
              <strong>実際の予約受付は、現在準備中です。</strong>
            </p>
            <button className="pill-button full" onClick={() => close(false)}>
              ホームページに戻る
              <ArrowRight size={17} />
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [plan, setPlan] = useState("体験してから相談したい");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState<"news" | "privacy" | null>(null);
  const book = (selected = "体験してから相談したい") => {
    setPlan(selected);
    setBookingOpen(true);
    setMenuOpen(false);
  };
  const monthlyPlans = [
    {
      name: "Light",
      jp: "自分のペースで、少しずつ",
      times: "月2回",
      price: "17,600",
      unit: "/ 月",
      per: "1回あたり 8,800円",
      recommended: false,
      points: [
        "1回50分のパーソナルトレーニング",
        "コンディショニング・ストレッチ",
        "毎回のカウンセリング",
      ],
    },
    {
      name: "Standard",
      jp: "週に一度、自分と向き合う時間",
      times: "月4回",
      price: "33,000",
      unit: "/ 月",
      per: "1回あたり 8,250円",
      recommended: true,
      points: [
        "1回50分のパーソナルトレーニング",
        "コンディショニング・ストレッチ",
        "食生活・運動習慣のアドバイス",
      ],
    },
    {
      name: "Personal",
      jp: "もう一歩、理想の自分へ",
      times: "月8回",
      price: "61,600",
      unit: "/ 月",
      per: "1回あたり 7,700円",
      recommended: false,
      points: [
        "1回50分のパーソナルトレーニング",
        "目的に合わせたメニュー設計",
        "食生活・運動習慣のアドバイス",
      ],
    },
  ];
  return (
    <div id="top" className="site-shell">
      <a className="skip-link" href="#main">
        本文へスキップ
      </a>
      <header className="site-header">
        <Logo />
        <nav className="desktop-nav" aria-label="メインナビゲーション">
          {nav.map(([label, id]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <button className="pill-button header-cta" onClick={() => book()}>
          体験レッスンを予約
          <ArrowUpRight size={16} />
        </button>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button className="mobile-menu" aria-label="メニューを開く">
              <Menu size={26} strokeWidth={1.4} />
            </button>
          </SheetTrigger>
          <SheetContent className="mobile-sheet">
            <SheetTitle>
              <span className="menu-title">パーソナルジム101</span>
            </SheetTitle>
            <nav aria-label="モバイルナビゲーション">
              {nav.map(([label, id]) => (
                <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
                  {label}
                  <ArrowUpRight size={17} />
                </a>
              ))}
            </nav>
            <button className="pill-button" onClick={() => book()}>
              体験レッスンを予約
              <ArrowRight size={17} />
            </button>
          </SheetContent>
        </Sheet>
      </header>
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span />
              わたしに、やさしいパーソナルジム。
            </div>
            <h1 id="hero-title">
              こころと、からだに、
              <br />
              <span>心地よい変化。</span>
            </h1>
            <p className="hero-description">
              誰かと比べるのではなく、昨日の自分より少し心地よく。
              <br className="desktop-break" />
              あなたのペースに寄り添う、パーソナルトレーニング。
            </p>
            <button className="pill-button hero-cta" onClick={() => book()}>
              <span>はじめての体験レッスン</span>
              <ArrowRight size={19} />
            </button>
            <span className="hero-note">運動がはじめての方も、お気軽に。</span>
            <a href="#concept" className="scroll-hint">
              <span>SCROLL TO DISCOVER</span>
              <span className="scroll-line" />
              <ArrowDown size={13} />
            </a>
          </div>
          <div className="hero-visual">
            <img
              src={images.hero}
              alt="パーソナルジム101のトレーニングルームと本格的な器具"
              fetchPriority="high"
            />
            <div className="image-count">
              <span>01</span>
              <span className="image-count-line" />
              <span>トレーニングルーム</span>
            </div>
          </div>
          <div className="hero-seal">
            <Sprout size={25} strokeWidth={1.1} />
            <span>
              自分らしく、
              <br />
              健やかに。
            </span>
            <small>JUST BE YOURSELF</small>
          </div>
        </section>
        <div className="promise-strip">
          <div>
            <Sprout strokeWidth={1.3} />
            <span>
              一人ひとりに寄り添う
              <span className="promise-en">PERSONAL SUPPORT</span>
            </span>
          </div>
          <div>
            <Heart strokeWidth={1.3} />
            <span>
              無理なく、心地よく続く
              <span className="promise-en">YOUR OWN PACE</span>
            </span>
          </div>
          <div>
            <Sun strokeWidth={1.3} />
            <span>
              ほっとできる、あたたかな空間
              <span className="promise-en">NATURAL & COMFORTABLE</span>
            </span>
          </div>
        </div>
        <div className="news-strip page-width">
          <span className="news-label">NEWS</span>
          <time dateTime="2026-12-01">2026.12</time>
          <span className="news-category">OPENING</span>
          <button onClick={() => setNotice("news")}>
            <span>
              2026年12月、パーソナルジム101がオープンします。
            </span>
            <ArrowUpRight size={18} />
          </button>
        </div>
        <section
          id="concept"
          className="concept-section page-width section-space"
        >
          <div className="concept-images">
            <div className="concept-main-photo">
              <img
                src={images.training}
                alt="トレーナーと笑顔でダンベルトレーニングをする女性のイメージ"
                loading="lazy"
              />
            </div>
            <div className="concept-small-photo">
              <img
                src={images.still}
                alt="自然光に包まれたタオルとオリーブの枝"
                loading="lazy"
              />
            </div>
            <span className="vertical-caption">MAKE TIME FOR YOURSELF.</span>
          </div>
          <div className="concept-copy">
            <SectionLabel number="01">OUR CONCEPT</SectionLabel>
            <h2>
              今の自分を変えたいから、
              <br />
              変わった自分に会える場所へ。
            </h2>
            <p>
              私たちが目指すのは、無理な食事制限や激しい運動で、
              <br />
              一時的に数字を変えることではありません。
            </p>
            <p>
              年齢を重ねても痛みや不調に悩まされず、
              <br />
              自分の足で軽やかに歩き続けられる、
              <br />
              「一生モノの身体の土台」を育てます。
            </p>
            <p>
              ほっと一息つける安心感と、会話や小さな変化を楽しめる時間を大切に。
              <br />
              厳しい指導や無理な引き止め、複雑なプランで迷わせることはありません。
            </p>
            <p>
              「また来たい」「自然と続けたくなる」——そんな場所を目指します。
              <br />
              自分の力でケアできる「自立」をゴールに、今のあなたに本当に必要なことだけを、
              <br />
              プロとして真っ直ぐ、丁寧にお伝えします。
            </p>
          </div>
        </section>
        <section id="features" className="features-section section-space">
          <div className="page-width">
            <div className="section-heading">
              <div>
                <SectionLabel number="02">WHY 101</SectionLabel>
                <h2>続けたくなる、3つの理由。</h2>
              </div>
              <p>
                鍛える時間も、整える時間も。
                <br />
                あなたにとって、心地よい場所であるために。
              </p>
            </div>
            <div className="feature-grid">
              {[
                {
                  n: "01",
                  image: images.training,
                  alt: "マンツーマンでのトレーニング風景",
                  label: "JUST FOR YOU",
                  title: (
                    <>
                      あなたのための、
                      <br />
                      オーダーメイド。
                    </>
                  ),
                  text: "体力も、目標も、生活リズムも人それぞれ。丁寧な対話を重ね、今のあなたに合うメニューをご提案します。",
                },
                {
                  n: "02",
                  image: images.studio,
                  alt: "木の温もりを感じるスタジオ",
                  label: "FEEL AT HOME",
                  title: (
                    <>
                      自然体でいられる、
                      <br />
                      やさしい空間。
                    </>
                  ),
                  text: "木の温もりと、窓から差し込むやわらかな光。人目を気にせず、自分のためだけの時間を過ごせます。",
                },
                {
                  n: "03",
                  image: images.still,
                  alt: "タオルとお水を揃えた心地よい空間",
                  label: "TRAIN & CARE",
                  title: (
                    <>
                      鍛えるだけじゃない、
                      <br />
                      ケアもできる場所。
                    </>
                  ),
                  text: "筋力トレーニングだけでなく、ストレッチやリラクゼーションも。頑張る日も、身体を整える日も、その日のあなたに合う過ごし方をご提案します。",
                },
              ].map(item => (
                <article className="feature" key={item.n}>
                  <div className="feature-photo">
                    <img src={item.image} alt={item.alt} loading="lazy" />
                    <span className="feature-number">{item.n}</span>
                  </div>
                  <span className="feature-label">{item.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="trainer" className="trainer-section page-width section-space">
          <div className="trainer-heading">
            <SectionLabel number="03">MEET YOUR TRAINER</SectionLabel>
            <h2>
              からだと向き合う時間を、あなたのそばで。
            </h2>
            <p>
              パーソナルジム101では、一人ひとりの目標や暮らしに合わせて、
              <br className="desktop-break" />
              無理なく続けられるトレーニングをご提案します。
            </p>
          </div>
          <div className="trainer-grid">
            <article className="trainer-card">
              <div className="trainer-photo-wrap">
                <img
                  src={images.trainer}
                  alt="パーソナルジム101のトレーナー"
                  loading="lazy"
                />
                <span className="trainer-photo-label">TRAINER / 01</span>
              </div>
              <div className="trainer-copy">
                <div className="trainer-meta">
                  <span className="trainer-role">PERSONAL TRAINER</span>
                  <strong>宮間（みやま）</strong>
                  <span className="trainer-status">茂原市出身 / 運動科学・トレーニング理論</span>
                </div>
                <p className="trainer-note">
                  運動科学・トレーニング理論の専門教育を修了後、フリーのパーソナルトレーナーとして経験を積み、地元・茂原へ。学生時代は部活に所属していなかったからこそ、運動が苦手な方の気持ちに寄り添い、無理なく続く習慣づくりをサポートします。
                </p>
              </div>
            </article>
            <article className="trainer-card">
              <div className="trainer-photo-wrap">
                <img
                  src={images.trainer02}
                  alt="パーソナルジム101のトレーナー"
                  loading="lazy"
                />
                <span className="trainer-photo-label">TRAINER / 02</span>
              </div>
              <div className="trainer-copy">
                <div className="trainer-meta">
                  <span className="trainer-role">PERSONAL TRAINER</span>
                  <strong>橋本（はしもと）</strong>
                  <span className="trainer-status">スポーツ系専門学校卒 / ケア・リラクゼーション</span>
                </div>
                <p className="trainer-note">
                  スポーツ系の専門学校を卒業後、女性の身体の仕組みやケアについて学んできました。トレーニングだけでなく、ストレッチやリラクゼーションも行い、その日の心と身体のコンディションに寄り添った時間をつくります。
                </p>
              </div>
            </article>
          </div>
        </section>
        <section id="plans" className="plans-section page-width section-space">
          <div className="section-heading">
            <div>
              <SectionLabel number="04">PROGRAM & PRICE</SectionLabel>
              <h2>
                あなたの暮らしに、
                <br className="mobile-break" />
                合うペースで。
              </h2>
            </div>
            <p>
              トレーニングも、ストレッチも。
              <br />
              その日のあなたに合わせた50分を。
            </p>
          </div>
          <div className="plan-grid" id="price-panel">
            {monthlyPlans.map(item => (
              <article
                className={`plan-card ${item.recommended ? "recommended" : ""}`}
                key={item.name}
              >
                {item.recommended && (
                  <span className="recommended-badge">習慣づくりにおすすめ</span>
                )}
                <div className="plan-top">
                  <h3>{item.name}</h3>
                  <span>{item.times}</span>
                </div>
                <p className="plan-tagline">{item.jp}</p>
                <div className="price">
                  <span className="yen">¥</span>
                  {item.price}
                  <span className="price-unit">{item.unit}</span>
                </div>
                <span className="price-per">{item.per}</span>
                <ul>
                  {item.points.map(point => (
                    <li key={point}>
                      <Check size={14} strokeWidth={1.6} />
                      {point}
                    </li>
                  ))}
                </ul>
                <button
                  className={`plan-button ${item.recommended ? "filled" : ""}`}
                  onClick={() => book(`${item.name}（${item.times}）`)}
                >
                  このプランで相談する
                  <ArrowRight size={16} />
                </button>
              </article>
            ))}
          </div>
          <p className="price-footnote">
            ※
            料金はすべて税込・デザイン確認用の参考価格です。入会金・プラン内容は、正式なご案内時に確定します。
          </p>
          <div className="trial-banner">
            <div className="trial-icon">
              <Leaf size={30} strokeWidth={1.1} />
            </div>
            <div>
              <span className="trial-label">FIRST TRIAL</span>
              <h3>まずは、心地よさを体験してみませんか。</h3>
              <p>カウンセリング ＋ トレーニング体験　約60分</p>
            </div>
            <div className="trial-price">
              <span>初回体験</span>
              <strong>
                ¥3,300<small>（税込・参考）</small>
              </strong>
            </div>
            <button
              className="round-arrow"
              aria-label="体験レッスンの案内を開く"
              onClick={() => book()}
            >
              <ArrowUpRight size={24} />
            </button>
          </div>
        </section>
        <section className="flow-section">
          <div className="page-width flow-layout">
            <div>
              <SectionLabel number="05">FIRST VISIT</SectionLabel>
              <h2>
                はじめの一歩は、
                <br />
                気軽な気持ちで。
              </h2>
              <p>
                特別な準備も、運動経験もいりません。
                <br />
                まずは、お話しするところから。
              </p>
            </div>
            <div className="flow-steps">
              {[
                {
                  title: "体験レッスンをご予約",
                  text: "ご希望の日時をお知らせください。あなたの都合に合わせて、体験の時間を調整します。",
                  icon: CalendarDays,
                },
                {
                  title: "お話を聞かせてください",
                  text: "運動のこと、暮らしのこと、なりたい自分のこと。ゆっくりお聞きします。",
                  icon: Heart,
                },
                {
                  title: "あなたに合う動きを体験",
                  text: "無理のないトレーニングを体験。終わったあとの、心地よさを感じてみてください。",
                  icon: Sprout,
                },
              ].map((step, i) => (
                <div className="flow-step" key={step.title}>
                  <span className="flow-number">0{i + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                  <step.icon strokeWidth={1.2} size={29} />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="faq" className="faq-section page-width section-space">
          <div>
            <SectionLabel number="06">QUESTIONS & ANSWERS</SectionLabel>
            <h2>
              気になること、
              <br />
              お答えします。
            </h2>
            <p>小さな不安も、ひとつずつ。</p>
          </div>
          <Accordion type="single" collapsible className="faq-list">
            {faqs.map(([q, a], i) => (
              <AccordionItem value={`faq-${i}`} key={q}>
                <AccordionTrigger className="faq-question">
                  <span className="q-mark">Q.</span>
                  <span>{q}</span>
                </AccordionTrigger>
                <AccordionContent className="faq-answer">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
        <section id="access" className="access-section page-width">
          <div className="access-photo">
            <img
              src={images.studio}
              alt="自然に囲まれたスタジオの内観イメージ"
              loading="lazy"
            />
            <span>YOUR LITTLE SANCTUARY.</span>
          </div>
          <div className="access-copy">
            <SectionLabel number="07">OUR STUDIO</SectionLabel>
            <h2>
              日常のそばに、
              <br />
              自分に戻れる場所を。
            </h2>
            <div className="studio-info">
              <MapPin size={19} strokeWidth={1.4} />
              <div>
                <strong>パーソナルジム101</strong>
                <p>〒297-0024 千葉県茂原市八千代1-3-11</p>
                <p>2026年12月オープン予定。</p>
              </div>
            </div>
            <div className="studio-info">
              <Clock3 size={19} strokeWidth={1.4} />
              <div>
                <strong>営業時間 8:00〜21:00</strong>
                <p>不定休・完全予約制</p>
              </div>
            </div>
            <span className="access-note">
              ※ 写真はスタジオのコンセプトイメージです。
            </span>
          </div>
        </section>
        <section className="closing-cta">
          <div className="closing-leaf">
            <Sprout strokeWidth={0.65} aria-hidden="true" />
          </div>
          <div className="page-width closing-content">
            <div>
              <span className="closing-eyebrow">
                A NEW CHAPTER, A HEALTHIER YOU.
              </span>
              <h2>
                これからの自分に、
                <br />
                ちょっといいこと、はじめよう。
              </h2>
              <p>小さな一歩が、毎日を少しずつ変えていく。</p>
            </div>
            <div className="closing-action">
              <button
                className="pill-button light-button"
                onClick={() => book()}
              >
                はじめての体験レッスン
                <ArrowUpRight size={20} />
              </button>
              <span>あなたにお会いできる日を、楽しみにしています。</span>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer page-width">
        <div className="footer-top">
          <Logo footer />
          <p>こころと、からだに、心地よい変化。</p>
          <a
            href="#top"
            className="back-to-top"
            aria-label="ページの先頭に戻る"
          >
            <ArrowRight size={20} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} パーソナルジム101</span>
          <button onClick={() => setNotice("privacy")}>
            プライバシーについて
            <ArrowUpRight size={12} />
          </button>
        </div>
        <p className="site-demo-disclosure">
          DESIGN PREVIEW —
          2026年12月オープン予定。サービス・料金は参考内容で、写真はAI生成イメージです。予約の送信機能は未接続です。
        </p>
      </footer>
      <BookingDialog
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        initialPlan={plan}
      />
      <Dialog
        open={notice !== null}
        onOpenChange={open => {
          if (!open) setNotice(null);
        }}
      >
        <DialogContent className="info-dialog">
          <DialogHeader>
            <span className="modal-eyebrow">
              {notice === "news" ? "NEWS · 2026.12 OPEN" : "PRIVACY"}
            </span>
            <DialogTitle className="modal-title">
              {notice === "news"
                ? "2026年12月、オープンします。"
                : "プライバシーについて"}
            </DialogTitle>
            <DialogDescription>
              {notice === "news"
                ? "あなたの日常に、新しい心地よさを。"
                : "このデモサイトでの情報の取り扱い"}
            </DialogDescription>
          </DialogHeader>
          <div className="info-body">
            {notice === "news" ? (
              <>
                <p>
                  パーソナルジム101は、2026年12月にオープンします。自分のからだと向き合い、心地よく続けられる時間をご用意します。
                </p>
                <p>
                  店舗情報、正式なプラン、予約受付の開始については、オープンに向けて順次ご案内します。
                </p>
              </>
            ) : (
              <>
                <p>
                  体験レッスンのデモフォームに入力した内容は、この画面内の確認表示のみに使用されます。入力内容を店舗へ送信したり、データベースやブラウザの保存領域に保管したりする機能はありません。フォームを閉じると入力内容は消去されます。
                </p>
                <p>
                  実際の予約受付は行っていません。デモではサンプルの氏名・メールアドレスをご使用ください。
                </p>
                <p>
                  このページは完成した事業者向けプライバシーポリシーではありません。正式公開時には、運営者情報、問い合わせ先、利用するアクセス解析や外部サービスを含めた方針を掲載してください。
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
