
import AppearanceToggleDropdown from "@/components/appearance-dropdown"
import type { SharedData } from "@/types"
import { Head, Link, usePage } from "@inertiajs/react"
import {
  GamepadIcon,
  Users,
  MessageSquare,
  Trophy,
  ChevronRight,
  Menu,
  X,
  Gamepad2,
  Globe,
  Shield,
} from "lucide-react"
import { useState, useEffect } from "react"

export default function Welcome() {
  const { auth } = usePage<SharedData>().props
  const currentYear = new Date().getFullYear()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  

  // Mobile menu toggle
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isMenuOpen])

  // FAQ data
  const faqs = [
    {
      question: "¿Qué es GameLive?",
      answer:
        "GameLive es una red social diseñada exclusivamente para gamers que te permite conectar con otros jugadores, compartir tus experiencias, encontrar compañeros de equipo y participar en torneos comunitarios.",
    },
    {
      question: "¿Es gratis registrarse?",
      answer:
        "Sí, crear una cuenta en GameLive es completamente gratuito. Ofrecemos funciones premium opcionales, pero todas las características principales están disponibles sin costo.",
    },
    {
      question: "¿Qué plataformas de juego son compatibles?",
      answer:
        "GameLive es compatible con todas las plataformas de juego, incluyendo PC, PlayStation, Xbox, Nintendo Switch y dispositivos móviles.",
    },
    {
      question: "¿Cómo puedo encontrar jugadores con intereses similares?",
      answer:
        "Nuestra plataforma utiliza un sistema de emparejamiento inteligente que te conecta con jugadores que comparten tus intereses, nivel de habilidad y horarios de juego preferidos.",
    },
  ]
 
  // Popular games
  const popularGames = [
    { id: 1, name: "Valorant", category: "fps", image: "/placeholder.svg?height=200&width=300" },
    { id: 2, name: "League of Legends", category: "moba", image: "/placeholder.svg?height=200&width=300" },
    { id: 3, name: "Fortnite", category: "battle-royale", image: "/placeholder.svg?height=200&width=300" },
    { id: 4, name: "Elden Ring", category: "rpg", image: "/placeholder.svg?height=200&width=300" },
    { id: 5, name: "Counter-Strike 2", category: "fps", image: "/placeholder.svg?height=200&width=300" },
    { id: 6, name: "World of Warcraft", category: "rpg", image: "/placeholder.svg?height=200&width=300" },
  ]

  // Filter games by category
  const filteredGames = activeTab === "all" ? popularGames : popularGames.filter((game) => game.category === activeTab)

  return (
    <>
      <Head title="GameLive - La red social para gamers">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
        <meta
          name="description"
          content="Únete a la red social definitiva para gamers. Conecta, comparte y compite con jugadores de todo el mundo."
        />
      </Head>
      <div className="flex min-h-[100dvh] flex-col bg-background text-foreground">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <GamepadIcon className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">GameLive</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Características
              </Link>
              <Link href="#games" className="text-sm font-medium hover:text-primary transition-colors">
                Juegos
              </Link>
              <Link href="#community" className="text-sm font-medium hover:text-primary transition-colors">
                Comunidad
              </Link>
              <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
                Testimonios
              </Link>
              <Link href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
                FAQ
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <AppearanceToggleDropdown />

              {/* Desktop Auth Buttons */}
              <div className="hidden sm:flex gap-2">
                {auth.user ? (
                  <Link
                    href={route("dashboard")}
                    className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Inicio
                  </Link>
                ) : (
                  <>
                    <Link
                      href={route("login")}
                      className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      href={route("register")}
                      className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                    >
                      Registrar
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={toggleMenu}
                aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div
              className="md:hidden"          
             
              
            >
              <div className="container py-4 flex flex-col space-y-4 border-t">
                <Link
                  href="#features"
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Características
                </Link>
                <Link
                  href="#games"
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Juegos
                </Link>
                <Link
                  href="#community"
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Comunidad
                </Link>
                <Link
                  href="#testimonials"
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Testimonios
                </Link>
                <Link
                  href="#faq"
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </Link>

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col gap-2 pt-2 border-t">
                  {auth.user ? (
                    <Link
                      href={route("dashboard")}
                      className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Inicio
                    </Link>
                  ) : (
                    <>
                      <Link
                        href={route("login")}
                        className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Iniciar sesión
                      </Link>
                      <Link
                        href={route("register")}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Registrar
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </header>

        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 -z-10 opacity-10">
              <div className="absolute inset-0 bg-grid-pattern" />
            </div>

            <div className=" px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div
                  className="flex flex-col justify-center space-y-4"                  
                >
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                      Conecta con Gamers <span className="text-primary">de todo el mundo</span>
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                      Únete a la red social definitiva creada exclusivamente para gamers. Comparte tus partidas,
                      encuentra compañeros de equipo y mejora tu experiencia de juego.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <div>
                      <Link
                        href={auth.user ? route("dashboard") : route("register")}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                      >
                        Comenzar <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                    <Link
                      href="#features"
                      className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      Más información
                    </Link>
                  </div>                 
                </div>
               
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div
                  className="space-y-2"                 
                >
                  <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                    Características
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                    Todo lo que necesitas en un solo lugar
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                    GameLive reúne todas las herramientas y funciones que necesitas para mejorar tu experiencia de
                    juego.
                  </p>
                </div>
              </div>

              <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                <div
                  className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                  <div className="rounded-full bg-primary/10 p-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Encuentra compañeros</h3>
                  <p className="text-center text-muted-foreground">
                    Conecta con jugadores que comparten tu estilo de juego y horarios.
                  </p>
                </div>

                <div
                  className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow"
                 >
                  <div className="rounded-full bg-primary/10 p-3">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Chat de juegos</h3>
                  <p className="text-center text-muted-foreground">
                    Salas de chat dedicadas a tus juegos y temas de gaming favoritos.
                  </p>
                </div>

                <div
                  className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow"
                 
                >
                  <div className="rounded-full bg-primary/10 p-3">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Torneos</h3>
                  <p className="text-center text-muted-foreground">
                    Compite en torneos comunitarios y gana recompensas exclusivas.
                  </p>
                </div>

                <div
                  className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow"
                
                >
                  <div className="rounded-full bg-primary/10 p-3">
                    <Gamepad2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Seguimiento de estadísticas</h3>
                  <p className="text-center text-muted-foreground">
                    Analiza tu rendimiento y mejora tus habilidades con estadísticas detalladas.
                  </p>
                </div>

                <div
                  className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow"
                  
                >
                  <div className="rounded-full bg-primary/10 p-3">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Eventos globales</h3>
                  <p className="text-center text-muted-foreground">
                    Participa en eventos especiales con jugadores de todo el mundo.
                  </p>
                </div>

                <div
                  className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow"
                 
                >
                  <div className="rounded-full bg-primary/10 p-3">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Comunidad segura</h3>
                  <p className="text-center text-muted-foreground">
                    Disfruta de un entorno libre de toxicidad con moderación activa.
                  </p>
                </div>
              </div>
            </div>
          </section>     


          {/* FAQ Section */}
          <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
            <div className="container px-4 md:px-6">
              <div
                className="flex flex-col items-center justify-center space-y-4 text-center mb-10"
                
              >
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                    Preguntas Frecuentes
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">¿Tienes dudas?</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                    Encuentra respuestas a las preguntas más comunes sobre GameLive.
                  </p>
                </div>
              </div>

              <div className="mx-auto max-w-3xl space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-lg border shadow-sm"
                    
                  >
                    <details className="group [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-4 font-medium">
                        {faq.question}
                        <ChevronRight className="h-5 w-5 shrink-0 transition-transform group-open:rotate-90" />
                      </summary>
                      <div className="border-t p-4 text-muted-foreground">{faq.answer}</div>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
            <div className="container px-4 md:px-6">
              <div
                className="flex flex-col items-center justify-center space-y-4 text-center"
           
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                    ¿Listo para mejorar tu experiencia de juego?
                  </h2>
                  <p className="max-w-[600px] md:text-xl/relaxed">
                    Únete a GameLive hoy y conecta con jugadores de todo el mundo.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <div>
                    <Link
                      href={route("register")}
                      className="inline-flex h-10 items-center justify-center rounded-md bg-background px-8 text-sm font-medium text-primary shadow hover:bg-accent transition-colors"
                    >
                      Regístrate gratis <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                  <Link
                    href="#features"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-primary-foreground bg-transparent px-8 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary-foreground hover:text-primary transition-colors"
                  >
                    Más información
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="w-full border-t bg-background">
          <div className="container flex flex-col gap-6 py-8 md:py-12">
            <div className="flex flex-col gap-6 md:flex-row md:justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <GamepadIcon className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">GameLive</span>
                </div>
                <p className="text-sm text-muted-foreground">La red social definitiva para gamers.</p>
              </div>
              <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-medium">Plataforma</h3>
                  <Link href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Características
                  </Link>
                  <Link href="#games" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Juegos
                  </Link>
                  <Link
                    href="#community"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Comunidad
                  </Link>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-medium">Empresa</h3>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Acerca de
                  </Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Empleo
                  </Link>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-medium">Legal</h3>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Privacidad
                  </Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Términos
                  </Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Política de cookies
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <p className="text-xs text-muted-foreground">© {currentYear} GameLive. Todos los derechos reservados.</p>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <span className="sr-only">Discord</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <circle cx="9" cy="12" r="1"></circle>
                    <circle cx="15" cy="12" r="1"></circle>
                    <path d="M7.5 7.5c3.5-1 5.5-1 9 0"></path>
                    <path d="M7 16.5c3.5 1 6.5 1 10 0"></path>
                    <path d="M15.5 17c0 1 1.5 3 2 3 1.5 0 2.833-1.667 3.5-3 .667-1.667.5-5.833-1.5-11.5-1.457-1.015-3-1.34-4.5-1.5l-1 2.5"></path>
                    <path d="M8.5 17c0 1-1.356 3-1.832 3-1.429 0-2.698-1.667-3.333-3-.635-1.667-.48-5.833 1.428-11.5C6.151 4.485 7.545 4.16 9 4l1 2.5"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

