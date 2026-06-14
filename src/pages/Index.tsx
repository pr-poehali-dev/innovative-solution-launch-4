import { useEffect, useRef, useState } from "react"
import { Menu, X, ChevronDown, Heart, MapPin, Clock, Camera, Upload } from "lucide-react"
import { AnimatedText } from "@/components/animated-text"
import Icon from "@/components/ui/icon"

const PHOTO_SLOTS = [
  { id: "hero", label: "Главное фото (герой)", aspect: "aspect-[4/3]" },
  { id: "photo1", label: "Фото 1", aspect: "aspect-square" },
  { id: "photo2", label: "Фото 2", aspect: "aspect-square" },
  { id: "photo3", label: "Фото 3", aspect: "aspect-square" },
  { id: "photo4", label: "Фото 4", aspect: "aspect-square" },
]

function PhotoSlot({
  slotId,
  label,
  aspect,
  photos,
  onUpload,
  className = "",
}: {
  slotId: string
  label: string
  aspect: string
  photos: Record<string, string>
  onUpload: (id: string, url: string) => void
  className?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const src = photos[slotId]

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onUpload(slotId, url)
  }

  return (
    <div
      className={`relative ${aspect} rounded-2xl overflow-hidden cursor-pointer group ${className}`}
      onClick={() => inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {src ? (
        <>
          <img src={src} alt={label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2 text-white">
              <Camera className="w-7 h-7" />
              <span className="text-xs font-medium">Заменить фото</span>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full bg-[#f0ebe3] flex flex-col items-center justify-center gap-3 text-[#6B6560] hover:bg-[#e8e1d8] transition-colors duration-300">
          <Upload className="w-8 h-8 opacity-50" />
          <span className="text-xs text-center px-4 leading-snug opacity-70">{label}</span>
        </div>
      )}
    </div>
  )
}

export default function WeddingPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [dynamicWordIndex, setDynamicWordIndex] = useState(0)
  const [wordFade, setWordFade] = useState(true)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [photos, setPhotos] = useState<Record<string, string>>({})
  const [rsvpName, setRsvpName] = useState("")
  const [rsvpGuests, setRsvpGuests] = useState("1")
  const [rsvpSent, setRsvpSent] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  const dynamicWords = ["любовь", "радость", "вас", "весну", "счастье"]

  useEffect(() => {
    const interval = setInterval(() => {
      setWordFade(false)
      setTimeout(() => {
        setDynamicWordIndex((prev) => (prev + 1) % dynamicWords.length)
        setWordFade(true)
      }, 300)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsLoaded(true)
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate-in")
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    )
    const elements = document.querySelectorAll(".animate-on-scroll")
    elements.forEach((el) => observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  const handleUpload = (id: string, url: string) => {
    setPhotos((prev) => ({ ...prev, [id]: url }))
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setIsMenuOpen(false)
  }

  return (
    <div className="relative min-h-screen bg-[#F9F6F1] text-[#1A1713] overflow-x-hidden">

      {/* HEADER */}
      <header className="fixed top-6 left-6 md:right-auto right-6 z-40 border border-black/10 backdrop-blur-md bg-[#F9F6F1]/80 rounded-[16px]">
        <div className="w-full mx-auto px-6">
          <div className="flex items-center gap-6 h-14">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-lg md:text-xl font-semibold font-serif hover:text-pink-500 transition-colors duration-300 tracking-wide"
            >
              М & А
            </button>
            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: "Детали", id: "details" },
                { label: "Программа", id: "schedule" },
                { label: "Галерея", id: "gallery" },
                { label: "Вопросы", id: "faq" },
                { label: "Подтвердить", id: "rsvp" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm text-[#6B6560] hover:text-[#1A1713] transition-colors duration-300"
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden ml-auto p-2 hover:bg-black/5 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#F9F6F1]/95 backdrop-blur-md z-50 flex flex-col items-start justify-end pb-20 pt-20 px-6">
          <div className="flex flex-col gap-8 items-start w-full">
            {[
              { label: "Детали", id: "details" },
              { label: "Программа", id: "schedule" },
              { label: "Галерея", id: "gallery" },
              { label: "Вопросы", id: "faq" },
              { label: "Подтвердить", id: "rsvp" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="font-serif text-5xl font-light text-[#1A1713] hover:text-pink-500 transition-colors duration-300"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* HERO */}
      <section
        ref={heroRef}
        className={`relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16 md:pt-32 md:pb-24 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${isLoaded ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"}`}
      >
        {photos["hero"] ? (
          <>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                transform: `translateY(${scrollY * 0.4}px)`,
                backgroundImage: `url(${photos["hero"]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F9F6F1] via-[#F9F6F1]/50 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-[#F9F6F1] to-rose-50 pointer-events-none" />
        )}

        <div
          className="max-w-[1120px] w-full mx-auto relative z-10"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        >
          <div className="text-center mb-10 md:mb-16">
            {/* Декоративный элемент */}
            <div className="flex items-center justify-center gap-3 mb-8 stagger-reveal">
              <div className="h-px w-16 bg-pink-300" />
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
              <div className="h-px w-16 bg-pink-300" />
            </div>

            <h1 className="font-serif mb-6 text-balance">
              <span
                className={`block stagger-reveal text-6xl md:text-8xl font-light transition-all duration-500 ${
                  wordFade ? "opacity-100 blur-0" : "opacity-0 blur-lg"
                }`}
              >
                Разделите <AnimatedText key={dynamicWordIndex} text={dynamicWords[dynamicWordIndex]} delay={0} />
              </span>
              <span className="block stagger-reveal text-6xl md:text-8xl font-light" style={{ animationDelay: "90ms" }}>
                с нами
              </span>
            </h1>

            <p className="text-[#6B6560] text-base md:text-xl max-w-[520px] mx-auto mb-3 leading-relaxed stagger-reveal" style={{ animationDelay: "180ms" }}>
              Михаил и Анна
            </p>
            <p className="text-pink-500 font-serif text-2xl md:text-3xl mb-10 stagger-reveal font-light" style={{ animationDelay: "220ms" }}>
              12 июля 2025
            </p>

            <div className="stagger-reveal flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: "270ms" }}>
              <button
                onClick={() => scrollToSection("rsvp")}
                className="px-8 py-4 bg-[#1A1713] text-[#F9F6F1] rounded-full text-sm font-medium hover:bg-[#2d2925] transition-all duration-300"
              >
                Подтвердить участие
              </button>
              <button
                onClick={() => scrollToSection("details")}
                className="px-8 py-4 bg-black/5 border border-black/10 rounded-full text-sm font-medium hover:bg-black/10 transition-all duration-300"
              >
                Узнать детали
              </button>
            </div>
          </div>

          {/* Hero photo upload */}
          <div className="mt-10 md:mt-16 stagger-reveal max-w-3xl mx-auto" style={{ animationDelay: "360ms" }}>
            <PhotoSlot slotId="hero" label="Нажмите, чтобы добавить главное фото" aspect="aspect-[16/9]" photos={photos} onUpload={handleUpload} className="rounded-3xl shadow-xl" />
          </div>
        </div>
      </section>

      {/* DETAILS */}
      <section id="details" className="relative py-20 md:py-32 px-4 animate-on-scroll">
        <div className="max-w-[1120px] w-full mx-auto">
          <div className="text-center mb-16">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#6B6560] mb-4 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
              ДЕТАЛИ ТОРЖЕСТВА
            </div>
            <h2 className="font-serif text-[32px] md:text-[48px] font-medium mb-4">
              Летняя свадьба{" "}
              <span style={{ background: "linear-gradient(135deg, #e8849a 0%, #c4a882 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                на природе
              </span>
            </h2>
            <p className="text-[#6B6560] max-w-[520px] mx-auto text-sm md:text-base leading-relaxed">
              Мы с радостью приглашаем вас разделить с нами этот особенный день среди зелени, свежего воздуха и тёплых объятий близких.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "Calendar",
                title: "Дата",
                main: "12 июля 2025",
                sub: "Суббота",
              },
              {
                icon: "Clock",
                title: "Время",
                main: "16:00",
                sub: "Сбор гостей с 15:30",
              },
              {
                icon: "MapPin",
                title: "Место",
                main: "Усадьба Зелёный Дол",
                sub: "Подмосковье, 45 км от МКАД",
              },
            ].map((item, i) => (
              <div key={i} className="p-8 border border-black/10 rounded-2xl text-center hover:border-pink-200 hover:bg-pink-50/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-5">
                  <Icon name={item.icon} size={20} className="text-pink-500" />
                </div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-[#6B6560] mb-2">{item.title}</div>
                <div className="font-serif text-xl md:text-2xl font-medium mb-1">{item.main}</div>
                <div className="text-sm text-[#6B6560]">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCHEDULE */}
      <section id="schedule" className="relative py-20 md:py-32 px-4 animate-on-scroll bg-[#F4EFE8]">
        <div className="max-w-[800px] w-full mx-auto">
          <div className="text-center mb-14">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#6B6560] mb-4 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
              ПРОГРАММА ДНЯ
            </div>
            <h2 className="font-serif text-[32px] md:text-[48px] font-medium">
              Как пройдёт{" "}
              <span style={{ background: "linear-gradient(135deg, #e8849a 0%, #c4a882 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                наш день
              </span>
            </h2>
          </div>

          <div className="space-y-0">
            {[
              { time: "15:30", title: "Сбор гостей", desc: "Встреча, шампанское и лёгкие закуски в саду" },
              { time: "16:00", title: "Церемония", desc: "Торжественная регистрация под открытым небом среди цветов и зелени" },
              { time: "17:00", title: "Фотосессия", desc: "Прогулка по территории усадьбы и первые совместные фото" },
              { time: "18:00", title: "Банкет", desc: "Праздничный ужин с живой музыкой и тостами" },
              { time: "20:00", title: "Танцы", desc: "Первый танец молодожёнов и танцпол до утра" },
              { time: "22:00", title: "Фейерверк", desc: "Яркий финал незабываемого вечера" },
            ].map((item, i, arr) => (
              <div key={i} className="flex gap-6 relative">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border-2 border-pink-300 bg-[#F4EFE8] flex items-center justify-center flex-shrink-0 z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-pink-400" />
                  </div>
                  {i < arr.length - 1 && <div className="w-px flex-1 bg-pink-200 my-1" />}
                </div>
                <div className={`pb-8 ${i === arr.length - 1 ? "" : ""}`}>
                  <div className="text-xs text-pink-500 font-medium mb-1 mt-2">{item.time}</div>
                  <div className="font-serif text-lg md:text-xl font-medium mb-1">{item.title}</div>
                  <div className="text-sm text-[#6B6560] leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="relative py-20 md:py-32 px-4 animate-on-scroll">
        <div className="max-w-[1120px] w-full mx-auto">
          <div className="text-center mb-14">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#6B6560] mb-4 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
              НАШИ ФОТО
            </div>
            <h2 className="font-serif text-[32px] md:text-[48px] font-medium mb-4">
              Мгновения{" "}
              <span style={{ background: "linear-gradient(135deg, #e8849a 0%, #c4a882 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                любви
              </span>
            </h2>
            <p className="text-[#6B6560] text-sm flex items-center justify-center gap-2">
              <Camera className="w-4 h-4" />
              Нажмите на любую ячейку, чтобы добавить своё фото
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <PhotoSlot slotId="photo1" label="Фото пары" aspect="aspect-square" photos={photos} onUpload={handleUpload} className="md:col-span-2 md:row-span-2 md:aspect-auto md:h-full min-h-[200px]" />
            <PhotoSlot slotId="photo2" label="Ваше фото" aspect="aspect-square" photos={photos} onUpload={handleUpload} />
            <PhotoSlot slotId="photo3" label="Ваше фото" aspect="aspect-square" photos={photos} onUpload={handleUpload} />
            <PhotoSlot slotId="photo4" label="Ваше фото" aspect="aspect-square" photos={photos} onUpload={handleUpload} />
            <PhotoSlot slotId="photo5" label="Ваше фото" aspect="aspect-square" photos={photos} onUpload={handleUpload} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative py-20 md:py-32 px-4 animate-on-scroll bg-[#F4EFE8]">
        <div className="max-w-[800px] w-full mx-auto">
          <div className="text-center mb-14">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#6B6560] mb-4 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
              ОТВЕТЫ НА ВОПРОСЫ
            </div>
            <h2 className="font-serif text-[32px] md:text-[48px] font-medium">
              Есть{" "}
              <span style={{ background: "linear-gradient(135deg, #e8849a 0%, #c4a882 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                вопросы
              </span>
              ?
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "Как добраться до места?", a: "Усадьба находится в 45 км от МКАД по Новорижскому шоссе. Мы организуем трансфер от метро Строгино в 14:00 и 15:00. Адрес и схема проезда будут отправлены отдельно." },
              { q: "Есть ли дресс-код?", a: "Мы будем рады видеть вас в нарядных, но комфортных образах. Палитра — нежные и пастельные тона. Просим воздержаться от белого и чёрного. Учтите, что часть праздника пройдёт на открытом воздухе." },
              { q: "Можно ли привести детей?", a: "Дети — это радость! Мы будем рады малышам. На площадке будет детская зона с аниматором. Пожалуйста, укажите возраст детей при подтверждении участия." },
              { q: "Что подарить?", a: "Самый ценный подарок для нас — ваше присутствие и тёплые слова. Если хочется сделать что-то большее — конверт со средствами на путешествие будет очень кстати." },
              { q: "Будет ли проживание?", a: "На территории усадьбы есть несколько гостевых домиков. Если вы хотите остаться на ночь, напишите нам заранее — забронируем место специально для вас." },
            ].map((faq, i) => (
              <div key={i} className="border border-black/10 rounded-xl overflow-hidden hover:border-pink-200 transition-all duration-300 bg-[#F9F6F1]">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-base md:text-lg font-medium pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 text-[#6B6560] transition-transform duration-300 ${openFaqIndex === i ? "rotate-180" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaqIndex === i ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <p className="px-6 pb-6 text-sm md:text-base text-[#6B6560] leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="relative py-24 md:py-40 px-4 animate-on-scroll overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-[#F9F6F1] to-rose-50 pointer-events-none" />
        <div className="max-w-[600px] w-full mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-16 bg-pink-300" />
            <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
            <div className="h-px w-16 bg-pink-300" />
          </div>
          <h2 className="font-serif text-[36px] md:text-[56px] font-medium mb-4 text-balance">
            Вы придёте?
          </h2>
          <p className="text-[#6B6560] text-base md:text-lg mb-10 leading-relaxed">
            Пожалуйста, подтвердите своё участие до <strong>1 июня 2025</strong>, чтобы мы могли подготовить всё для вашего комфорта.
          </p>

          {rsvpSent ? (
            <div className="p-8 border border-pink-200 rounded-2xl bg-pink-50">
              <Heart className="w-10 h-10 text-pink-400 fill-pink-400 mx-auto mb-4" />
              <div className="font-serif text-2xl mb-2">Спасибо, {rsvpName}!</div>
              <p className="text-[#6B6560] text-sm">Мы уже ждём встречи с вами 12 июля ✨</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 text-left">
              <div>
                <label className="text-xs uppercase tracking-[0.15em] text-[#6B6560] mb-2 block">Ваше имя</label>
                <input
                  type="text"
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="Иван Иванов"
                  className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-sm text-[#1A1713] placeholder-[#6B6560]/50 focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-200 transition-all"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.15em] text-[#6B6560] mb-2 block">Количество гостей</label>
                <select
                  value={rsvpGuests}
                  onChange={(e) => setRsvpGuests(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl text-sm text-[#1A1713] focus:outline-none focus:border-pink-300 transition-all appearance-none"
                >
                  {["1", "2", "3", "4"].map((n) => (
                    <option key={n} value={n}>{n} {n === "1" ? "гость" : n === "2" || n === "3" || n === "4" ? "гостя" : "гостей"}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  if (rsvpName.trim()) setRsvpSent(true)
                }}
                className="w-full py-4 bg-[#1A1713] text-[#F9F6F1] rounded-xl text-sm font-medium hover:bg-[#2d2925] transition-all duration-300 mt-2"
              >
                Подтвердить участие
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative px-4 border-t border-black/5 py-10 bg-[#F9F6F1]">
        <div className="max-w-[1120px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#6B6560]">
          <div className="font-serif text-lg text-[#1A1713]">Михаил & Анна · 12.07.2025</div>
          <div className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
            <span>Сделано с любовью</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
