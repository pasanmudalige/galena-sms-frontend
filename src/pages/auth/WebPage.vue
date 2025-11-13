<template>
  <q-page class="webpage-container">
    <!-- Navigation Header -->
    <q-header elevated class="bg-white text-primary shadow-2" id="header">
      <q-toolbar class="q-px-md">
        <q-toolbar-title class="row items-center">
          <img src="~assets/galena.png" alt="Logo" class="header-logo" />
        </q-toolbar-title>
        <q-space />
        <div class="row q-gutter-sm gt-xs">
          <q-btn flat no-caps label="Home" @click="scrollTo('hero')" class="text-primary" />
          <q-btn flat no-caps label="About" @click="scrollTo('about')" class="text-primary" />
          <q-btn flat no-caps label="Courses" @click="scrollTo('courses')" class="text-primary" />
          <q-btn
            flat
            no-caps
            label="Facilities"
            @click="scrollTo('facilities')"
            class="text-primary"
          />
          <q-btn flat no-caps label="Gallery" @click="scrollTo('gallery')" class="text-primary" />
          <q-btn flat no-caps label="Contact" @click="scrollTo('contact')" class="text-primary" />
        </div>
        <q-btn
          no-caps
          unelevated
          color="primary"
          label="Student Login"
          to="/login"
          class="q-ml-md"
        />
        <q-btn
          no-caps
          outline
          target="_blank"
          color="primary"
          label="Create Student Account"
          to="/student-register"
          class="q-ml-sm"
        />
        <q-btn flat dense round icon="menu" @click="drawer = !drawer" class="lt-sm" />
      </q-toolbar>
    </q-header>

    <!-- Mobile Drawer -->
    <q-drawer v-model="drawer" side="right" overlay bordered>
      <q-list>
        <q-item clickable @click="scrollToAndClose('hero')">
          <q-item-section>Home</q-item-section>
        </q-item>
        <q-item clickable @click="scrollToAndClose('about')">
          <q-item-section>About</q-item-section>
        </q-item>
        <q-item clickable @click="scrollToAndClose('courses')">
          <q-item-section>Courses</q-item-section>
        </q-item>
        <q-item clickable @click="scrollToAndClose('facilities')">
          <q-item-section>Facilities</q-item-section>
        </q-item>
        <q-item clickable @click="scrollToAndClose('gallery')">
          <q-item-section>Gallery</q-item-section>
        </q-item>
        <q-item clickable @click="scrollToAndClose('contact')">
          <q-item-section>Contact</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable to="/login" @click="drawer = false">
          <q-item-section>
            <q-btn no-caps unelevated color="primary" label="Student Login" class="full-width" />
          </q-item-section>
        </q-item>
        <q-item clickable to="/student-register" @click="drawer = false">
          <q-item-section>
            <q-btn
              no-caps
              outline
              color="primary"
              label="Create Student Account"
              class="full-width q-mt-sm"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Hero Section -->
    <section id="hero" class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Galena Educational Institute</h1>
        <p class="hero-tagline">Empowering Minds, Shaping Futures</p>
        <p class="hero-description">
          Excellence in education since 2019. We are committed to providing quality education that
          prepares students for success in an ever-changing world.
        </p>
        <q-btn
          no-caps
          unelevated
          color="primary"
          size="lg"
          label="Contact Us"
          @click="scrollTo('contact')"
          class="q-mt-lg"
        />
      </div>
    </section>

    <!-- About Us Section -->
    <section id="about" class="section-container bg-white">
      <div class="container">
        <h2 class="section-title">About Us</h2>
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-4">
            <q-card class="about-card">
              <q-card-section>
                <q-icon name="flag" size="48px" color="primary" class="q-mb-md" />
                <h3 class="text-h5 q-mb-md">Our Mission</h3>
                <p class="text-body1">
                  To provide exceptional educational experiences that foster intellectual growth,
                  character development, and prepare students to become responsible global citizens.
                </p>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card class="about-card">
              <q-card-section>
                <q-icon name="visibility" size="48px" color="primary" class="q-mb-md" />
                <h3 class="text-h5 q-mb-md">Our Vision</h3>
                <p class="text-body1">
                  To be a leading educational institution recognized for academic excellence,
                  innovation, and commitment to nurturing well-rounded individuals who contribute
                  positively to society.
                </p>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card class="about-card">
              <q-card-section>
                <q-icon name="favorite" size="48px" color="primary" class="q-mb-md" />
                <h3 class="text-h5 q-mb-md">Our Values</h3>
                <p class="text-body1">
                  Integrity, Excellence, Respect, Innovation, and Community. These core values guide
                  everything we do and shape the character of our students.
                </p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Courses Section -->
    <section id="courses" class="section-container bg-grey-1">
      <div class="container">
        <h2 class="section-title">Our Courses</h2>
        <p class="section-subtitle">Explore our diverse range of academic programs</p>
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-sm-6 col-md-4" v-for="course in courses" :key="course.id">
            <q-card class="course-card">
              <q-card-section>
                <q-icon :name="course.icon" size="40px" color="primary" class="q-mb-md" />
                <h3 class="text-h6 q-mb-sm">{{ course.name }}</h3>
                <p class="text-body2 text-grey-7">{{ course.description }}</p>
                <q-chip
                  :label="course.duration"
                  color="primary"
                  text-color="white"
                  class="q-mt-md"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Facilities Section -->
    <section id="facilities" class="section-container bg-white">
      <div class="container">
        <h2 class="section-title">Our Facilities</h2>
        <p class="section-subtitle">State-of-the-art infrastructure for holistic development</p>
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-sm-6 col-md-3" v-for="facility in facilities" :key="facility.id">
            <q-card class="facility-card text-center">
              <q-card-section>
                <q-avatar size="80px" color="primary" text-color="white" class="q-mb-md">
                  <q-icon :name="facility.icon" size="40px" />
                </q-avatar>
                <h3 class="text-h6 q-mb-sm">{{ facility.name }}</h3>
                <p class="text-body2 text-grey-7">{{ facility.description }}</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery Section -->
    <section id="gallery" class="section-container bg-grey-1">
      <div class="container">
        <h2 class="section-title">Gallery & Achievements</h2>
        <p class="section-subtitle">Celebrating our students' success and campus life</p>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-4" v-for="(item, index) in gallery" :key="index">
            <q-card class="gallery-card">
              <q-img
                :src="item.image"
                :alt="item.caption"
                class="gallery-image"
                style="height: 250px"
              >
                <div class="absolute-full flex flex-center bg-transparent">
                  <q-icon name="image" size="64px" color="white" opacity="0.3" />
                </div>
              </q-img>
              <q-card-section>
                <div class="text-h6 q-mb-xs">{{ item.title }}</div>
                <div class="text-body2 text-grey-7">{{ item.caption }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Us Section -->
    <section id="contact" class="section-container bg-grey-1">
      <div class="container">
        <h2 class="section-title">Contact Us</h2>
        <p class="section-subtitle">Get in touch with us</p>
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-4">
            <q-card class="contact-info-card">
              <q-card-section>
                <h3 class="text-h6 q-mb-md">Contact Information</h3>
                <div class="q-mb-md">
                  <div class="row items-center q-mb-sm">
                    <q-icon name="location_on" color="primary" size="24px" class="q-mr-sm" />
                    <span class="text-body1">301 Morris Rd, Galle 80000</span>
                  </div>
                  <div class="row items-center q-mb-sm">
                    <q-icon name="phone" color="primary" size="24px" class="q-mr-sm" />
                    <span class="text-body1">+94 71 53 68 553</span>
                  </div>
                  <div class="row items-center q-mb-sm">
                    <q-icon name="email" color="primary" size="24px" class="q-mr-sm" />
                    <span class="text-body1">edu.galenainstitute@gmail.com</span>
                  </div>
                </div>
                <div class="row q-gutter-sm">
                  <q-btn
                    round
                    color="primary"
                    icon="facebook"
                    href="https://www.facebook.com/institutegalena/"
                    target="_blank"
                  />
                  <q-btn
                    round
                    color="primary"
                    icon="whatsapp"
                    :href="`https://wa.me/94715368553`"
                    target="_blank"
                  />
                  <q-btn
                    round
                    color="primary"
                    icon="instagram"
                    href="https://www.instagram.com/galenainstitute/"
                    target="_blank"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-8">
            <q-card>
              <q-card-section>
                <h3 class="text-h6 q-mb-md">Send us a Message</h3>
                <q-form @submit="onContactSubmit" class="q-gutter-md">
                  <q-input
                    v-model="contactForm.name"
                    outlined
                    label="Your Name *"
                    :rules="[(val) => !!val || 'Name is required']"
                  />
                  <q-input
                    v-model="contactForm.email"
                    outlined
                    type="email"
                    label="Your Email *"
                    :rules="[
                      (val) => !!val || 'Email is required',
                      (val) => /.+@.+\..+/.test(val) || 'Invalid email',
                    ]"
                  />
                  <q-input v-model="contactForm.phone" outlined label="Phone Number" />
                  <q-input
                    v-model="contactForm.message"
                    outlined
                    type="textarea"
                    label="Message *"
                    rows="5"
                    :rules="[(val) => !!val || 'Message is required']"
                  />
                  <q-btn
                    type="submit"
                    no-caps
                    unelevated
                    color="primary"
                    label="Send Message"
                    class="full-width"
                    size="lg"
                  />
                </q-form>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer-section bg-dark text-white">
      <div class="container">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-4">
            <h4 class="text-h6 q-mb-md">Galena Educational Institute</h4>
            <p class="text-body2">
              Empowering minds and shaping futures through quality education.
            </p>
          </div>
          <div class="col-12 col-md-4">
            <h4 class="text-h6 q-mb-md">Quick Links</h4>
            <q-list dense>
              <q-item clickable @click="scrollTo('about')">
                <q-item-section>About Us</q-item-section>
              </q-item>
              <q-item clickable @click="scrollTo('courses')">
                <q-item-section>Courses</q-item-section>
              </q-item>
              <q-item clickable @click="scrollTo('contact')">
                <q-item-section>Contact</q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-12 col-md-4">
            <h4 class="text-h6 q-mb-md">Follow Us</h4>
            <div class="row q-gutter-sm">
              <q-btn round color="white" text-color="primary" icon="facebook" />
              <q-btn round color="white" text-color="primary" icon="twitter" />
              <q-btn round color="white" text-color="primary" icon="instagram" />
              <q-btn round color="white" text-color="primary" icon="linkedin" />
            </div>
          </div>
        </div>
        <q-separator color="grey-7" class="q-my-lg" />
        <div class="text-center text-body2">
          &copy; {{ currentYear }} Galena Educational Institute. All rights reserved.
        </div>
      </div>
    </footer>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'

defineOptions({
  name: 'WebPage',
})

const $q = useQuasar()
const drawer = ref(false)

const currentYear = computed(() => new Date().getFullYear())

const contactForm = ref({
  name: '',
  email: '',
  phone: '',
  message: '',
})

const courses = ref([
  {
    id: 1,
    name: 'Computer Science',
    description:
      'Comprehensive program covering programming, algorithms, and software engineering.',
    duration: '4 Years',
    icon: 'computer',
  },
  {
    id: 2,
    name: 'Business Administration',
    description: 'Learn management principles, entrepreneurship, and business strategy.',
    duration: '4 Years',
    icon: 'business',
  },
  {
    id: 3,
    name: 'Engineering',
    description: 'Mechanical, Electrical, and Civil Engineering specializations available.',
    duration: '4 Years',
    icon: 'engineering',
  },
  {
    id: 4,
    name: 'Medicine',
    description: 'Rigorous medical program preparing future healthcare professionals.',
    duration: '6 Years',
    icon: 'local_hospital',
  },
  {
    id: 5,
    name: 'Arts & Humanities',
    description: 'Explore literature, history, philosophy, and creative arts.',
    duration: '3 Years',
    icon: 'palette',
  },
  {
    id: 6,
    name: 'Science & Mathematics',
    description: 'Advanced studies in Physics, Chemistry, Biology, and Mathematics.',
    duration: '4 Years',
    icon: 'science',
  },
])

const facilities = ref([
  {
    id: 1,
    name: 'Library',
    description: 'Extensive collection of books, journals, and digital resources.',
    icon: 'menu_book',
  },
  {
    id: 2,
    name: 'Laboratories',
    description: 'Modern labs equipped with latest technology and equipment.',
    icon: 'biotech',
  },
  {
    id: 3,
    name: 'Sports Complex',
    description: 'State-of-the-art sports facilities for various athletic activities.',
    icon: 'sports_soccer',
  },
  {
    id: 4,
    name: 'Hostel',
    description: 'Comfortable accommodation with all modern amenities for students.',
    icon: 'home',
  },
])

const gallery = ref([
  {
    title: 'Annual Science Fair',
    caption: 'Students showcasing innovative projects and research.',
    image: 'https://via.placeholder.com/400x250?text=Science+Fair',
  },
  {
    title: 'Sports Day',
    caption: 'Annual sports competition celebrating athletic excellence.',
    image: 'https://via.placeholder.com/400x250?text=Sports+Day',
  },
  {
    title: 'Graduation Ceremony',
    caption: 'Celebrating the achievements of our graduating class.',
    image: 'https://via.placeholder.com/400x250?text=Graduation',
  },
  {
    title: 'Cultural Festival',
    caption: 'Showcasing diverse talents and cultural heritage.',
    image: 'https://via.placeholder.com/400x250?text=Cultural+Festival',
  },
  {
    title: 'Award Ceremony',
    caption: 'Recognizing outstanding academic and extracurricular achievements.',
    image: 'https://via.placeholder.com/400x250?text=Awards',
  },
  {
    title: 'Campus Life',
    caption: 'Students engaged in various campus activities and events.',
    image: 'https://via.placeholder.com/400x250?text=Campus+Life',
  },
])

const scrollTo = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const scrollToAndClose = (sectionId) => {
  scrollTo(sectionId)
  drawer.value = false
}

const onContactSubmit = () => {
  $q.notify({
    type: 'positive',
    message: 'Thank you for your message! We will get back to you soon.',
    position: 'top',
  })
  // Reset form
  contactForm.value = {
    name: '',
    email: '',
    phone: '',
    message: '',
  }
}

onMounted(() => {
  // Add smooth scroll behavior
  document.documentElement.style.scrollBehavior = 'smooth'
})
</script>

<style scoped>
.webpage-container {
  padding-top: 64px;
}

.header-logo {
  height: 50px;
  width: auto;
}

.hero-section {
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 80px 20px;
}

.hero-content {
  max-width: 800px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-tagline {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  opacity: 0.95;
}

.hero-description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.section-container {
  padding: 80px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
  color: #1976d2;
}

.section-subtitle {
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 3rem;
}

.about-card,
.course-card,
.facility-card,
.gallery-card {
  height: 100%;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.about-card:hover,
.course-card:hover,
.facility-card:hover,
.gallery-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.contact-info-card {
  height: 100%;
}

.gallery-image {
  object-fit: cover;
}

.footer-section {
  padding: 60px 20px 30px;
  background-color: #1a1a1a;
}

.footer-section .container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Responsive Design */
@media (max-width: 600px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-tagline {
    font-size: 1.4rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-container {
    padding: 60px 20px;
  }
}

@media (max-width: 400px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-tagline {
    font-size: 1.2rem;
  }
}
</style>
