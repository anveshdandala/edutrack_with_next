import Navbar from "@/components/layout/Navbar"
import CustomButton from "@/components/common/CustomButton"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4">
        <section className="py-20 text-center space-y-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
              A Centralised Digital Platform for Comprehensive Student Activity Record in HEIs
            </h1>

            <div className="text-lg md:text-xl text-muted-foreground space-y-2 max-w-3xl mx-auto">
              <p>
                This platform helps students build a verified portfolio while institutions get ready-to-use reports for
                NAAC, AICTE, and NIRF accreditation.
              </p>
              <p>
                Streamline documentation, enhance transparency, and support institutional excellence through
                comprehensive activity tracking.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/auth">
                <CustomButton size="lg" className="text-lg px-8">
                  Get Started
                </CustomButton>
              </Link>
              <Link href="#demo">
                <CustomButton variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                  Watch Demo
                </CustomButton>
              </Link>
            </div>
          </div>
        </section>

        <section id="demo" className="py-16">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Platform Demo Video</h3>
                  <p className="text-muted-foreground">Video will be embedded here to showcase the platform features</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-16">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Key Features</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive tools for students and institutions to track, verify, and report academic activities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Verified Portfolio</h3>
                <p className="text-muted-foreground">
                  Students can build and maintain a comprehensive, verified record of all academic activities
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto">
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Automated Reports</h3>
                <p className="text-muted-foreground">
                  Generate ready-to-use reports for NAAC, AICTE, and NIRF accreditation processes
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto">
                  <svg
                    className="w-6 h-6 text-purple-600 dark:text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Institutional Dashboard</h3>
                <p className="text-muted-foreground">
                  Comprehensive analytics and insights for faculty and administrative staff
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 StudentHub Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
