"use client"

import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react"
import { useLanguage } from "@/lib/hooks/use-language"
import { translations } from "@/lib/i18n/translations"
import { motion } from "framer-motion"

export default function ContactPage() {
  const { language } = useLanguage()
  const t = translations[language]

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-900/20 py-16">
          <div className="container mx-auto px-4">
            <motion.div {...fadeIn} className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 text-balance">
                {t.contactTitle}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 text-pretty">
                {t.contactSubtitle}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-3">
              {/* Contact Info Cards */}
              <div className="lg:col-span-1 space-y-6">
                <motion.div {...fadeIn}>
                  <Card className="border-2 border-blue-100 dark:border-blue-900/30 dark:bg-gray-900">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t.visitUs}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            EthioGerman Language School
                            <br />
                            Bole Road, near Edna Mall
                            <br />
                            3rd Floor, Millennium Plaza
                            <br />
                            Addis Ababa, Ethiopia
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
                  <Card className="border-2 border-blue-100 dark:border-blue-900/30 dark:bg-gray-900">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <Phone className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t.callUs}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                            <a href="tel:+251911234567" className="hover:text-blue-600 transition-colors">
                              +251 911 234 567
                            </a>
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            <a href="tel:+251912345678" className="hover:text-blue-600 transition-colors">
                              +251 912 345 678
                            </a>
                          </p>
                          <p className="text-xs text-gray-500 mt-2">Office: +251 11 618 1234</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
                  <Card className="border-2 border-blue-100 dark:border-blue-900/30 dark:bg-gray-900">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <Mail className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t.emailUs}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                            <a href="mailto:info@ethiogerman.com" className="hover:text-blue-600 transition-colors">
                              info@ethiogerman.com
                            </a>
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                            <a href="mailto:admissions@ethiogerman.com" className="hover:text-blue-600 transition-colors">
                              admissions@ethiogerman.com
                            </a>
                          </p>
                          <p className="text-xs text-gray-500 mt-2">Response time: Within 24 hours</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
                  <Card className="border-2 border-blue-100 dark:border-blue-900/30 dark:bg-gray-900">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t.officeHours}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Monday - Friday: 8:00 AM - 6:00 PM</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Saturday: 9:00 AM - 4:00 PM</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">Sunday: Closed</p>
                          <p className="text-xs text-gray-500 mt-2">Ethiopian Public Holidays: Closed</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
                  <Card className="border-2 border-orange-100 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-900/30">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-orange-600 flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t.whatsappSupport}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{t.whatsappSupportText}</p>
                          <a
                            href="https://wa.me/251911234567"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
                          >
                            {t.chatWithUs} →
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-2 border-blue-100 dark:border-blue-900/30 dark:bg-gray-900">
                    <CardHeader>
                      <CardTitle className="text-2xl dark:text-white">{t.sendMessage}</CardTitle>
                      <CardDescription className="dark:text-gray-400">{t.sendMessageSubtitle}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className="dark:text-gray-300">{t.firstName} *</Label>
                            <Input id="firstName" placeholder="Abebe" required className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="dark:text-gray-300">{t.lastName} *</Label>
                            <Input id="lastName" placeholder="Kebede" required className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="dark:text-gray-300">{t.emailAddress} *</Label>
                          <Input id="email" type="email" placeholder="abebe.kebede@email.com" required className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="dark:text-gray-300">{t.phoneNumber} *</Label>
                          <Input id="phone" type="tel" placeholder="+251 911 234 567" required className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="interest" className="dark:text-gray-300">{t.interestedIn} *</Label>
                          <select
                            id="interest"
                            className="w-full h-10 rounded-md border border-input bg-background dark:bg-gray-800 dark:border-gray-700 dark:text-white px-3 py-2 text-sm"
                            required
                          >
                            <option value="">{t.selectOption}</option>
                            <option value="online">{t.onlineGermanCourses}</option>
                            <option value="onsite">{t.onsiteCourses}</option>
                            <option value="one-to-one">{t.oneToOneTutoring}</option>
                            <option value="goethe">{t.goetheExamPrep}</option>
                            <option value="corporate">{t.corporateTraining}</option>
                            <option value="other">{t.otherInquiry}</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="level" className="dark:text-gray-300">{t.currentGermanLevel}</Label>
                          <select
                            id="level"
                            className="w-full h-10 rounded-md border border-input bg-background dark:bg-gray-800 dark:border-gray-700 dark:text-white px-3 py-2 text-sm"
                          >
                            <option value="">{t.selectLevel}</option>
                            <option value="beginner">{t.completeBeginner}</option>
                            <option value="elementary">{t.elementary}</option>
                            <option value="intermediate">{t.intermediate}</option>
                            <option value="upper">{t.upperIntermediate}</option>
                            <option value="advanced">{t.advanced}</option>
                            <option value="mastery">{t.mastery}</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message" className="dark:text-gray-300">{t.yourMessage} *</Label>
                          <Textarea
                            id="message"
                            placeholder={t.messagePlaceholder}
                            rows={6}
                            required
                            className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="consent" className="h-4 w-4" required />
                          <Label htmlFor="consent" className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                            {t.consentText}
                          </Label>
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                          <Send className="h-4 w-4 mr-2" />
                          {t.sendMessageBtn}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Map */}
                <motion.div {...fadeIn} transition={{ delay: 0.5 }}>
                  <Card className="mt-8 border-2 border-gray-100 dark:border-gray-800 dark:bg-gray-900">
                    <CardContent className="p-0">
                      <div className="w-full h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <div className="text-center p-8">
                          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">{t.visitCampus}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            Bole Road, Millennium Plaza, 3rd Floor
                            <br />
                            Near Edna Mall, Addis Ababa
                          </p>
                          <Button variant="outline" className="mt-4 bg-transparent dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700" asChild>
                            <a
                              href="https://maps.google.com/?q=Bole+Road+Addis+Ababa"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t.getDirections}
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            <motion.div {...fadeIn} className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t.haveQuestions}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {t.haveQuestionsText}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="outline" size="lg" className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                  {t.viewFaqs}
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" size="lg">
                  {t.scheduleFreeConsultation}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

