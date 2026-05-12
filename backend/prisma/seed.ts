import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();

  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: "Kaspi.kz",
        description: "Крупнейший финтех и маркетплейс Казахстана. Разрабатываем суперапп для 14 млн пользователей.",
        logoUrl: null,
        website: "https://kaspi.kz",
        city: "Almaty",
      },
    }),
    prisma.company.create({
      data: {
        name: "Kolesa Group",
        description: "Ведущая группа компаний в сфере онлайн-объявлений: Kolesa.kz, Krisha.kz, Market.kz.",
        logoUrl: null,
        website: "https://kolesa.kz",
        city: "Almaty",
      },
    }),
    prisma.company.create({
      data: {
        name: "Jusan Bank",
        description: "Цифровой банк с фокусом на мобильном приложении и инновационных финансовых продуктах.",
        logoUrl: null,
        website: "https://jusan.kz",
        city: "Astana",
      },
    }),
    prisma.company.create({
      data: {
        name: "2GIS",
        description: "Разработчик карт и справочника организаций с офисами в СНГ и собственным стеком технологий.",
        logoUrl: null,
        website: "https://2gis.kz",
        city: "Almaty",
      },
    }),
    prisma.company.create({
      data: {
        name: "Samruk Digital",
        description: "IT-компания фонда Самрук-Казына, цифровая трансформация государственных предприятий.",
        logoUrl: null,
        website: "https://samruk.kz",
        city: "Astana",
      },
    }),
  ]);

  const [kaspi, kolesa, jusan, gis, samruk] = companies;

  await Promise.all([
    // Kaspi jobs
    prisma.job.create({
      data: {
        title: "Frontend Developer",
        description: "Разработка UI для суперапп Kaspi. Работа с React, оптимизация производительности, внедрение дизайн-системы.",
        city: "Almaty",
        grade: "Middle",
        workFormat: "Hybrid",
        salaryFrom: 400000,
        salaryTo: 600000,
        skills: JSON.stringify(["React", "TypeScript", "Redux", "CSS", "Performance"]),
        companyId: kaspi.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "Backend Developer (Java)",
        description: "Разработка высоконагруженных сервисов на Java Spring Boot. Работа с микросервисной архитектурой.",
        city: "Almaty",
        grade: "Senior",
        workFormat: "Office",
        salaryFrom: 700000,
        salaryTo: 1000000,
        skills: JSON.stringify(["Java", "Spring Boot", "Kafka", "PostgreSQL", "Microservices"]),
        companyId: kaspi.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "Junior iOS Developer",
        description: "Разработка фич для мобильного приложения Kaspi.kz под iOS. Менторинг от senior-разработчиков.",
        city: "Almaty",
        grade: "Junior",
        workFormat: "Office",
        salaryFrom: 250000,
        salaryTo: 350000,
        skills: JSON.stringify(["Swift", "UIKit", "SwiftUI", "Xcode", "Git"]),
        companyId: kaspi.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "Data Engineer",
        description: "Построение ETL-пайплайнов, работа с большими данными транзакций, Spark, Airflow.",
        city: "Almaty",
        grade: "Middle",
        workFormat: "Hybrid",
        salaryFrom: 500000,
        salaryTo: 750000,
        skills: JSON.stringify(["Python", "Apache Spark", "Airflow", "SQL", "Kafka"]),
        companyId: kaspi.id,
      },
    }),

    // Kolesa jobs
    prisma.job.create({
      data: {
        title: "React Developer",
        description: "Разработка новых фич для Kolesa.kz и Market.kz. Участие в code-review, написание тестов.",
        city: "Almaty",
        grade: "Middle",
        workFormat: "Remote",
        salaryFrom: 350000,
        salaryTo: 550000,
        skills: JSON.stringify(["React", "TypeScript", "GraphQL", "Jest", "Git"]),
        companyId: kolesa.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "Junior Frontend Developer",
        description: "Верстка компонентов, интеграция с API, работа в команде опытных разработчиков Kolesa Group.",
        city: "Almaty",
        grade: "Junior",
        workFormat: "Office",
        salaryFrom: 200000,
        salaryTo: 300000,
        skills: JSON.stringify(["HTML", "CSS", "JavaScript", "React", "Git"]),
        companyId: kolesa.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "Backend Developer (Go)",
        description: "Разработка API-сервисов на Go, работа с высоконагруженными системами объявлений.",
        city: "Almaty",
        grade: "Senior",
        workFormat: "Remote",
        salaryFrom: 650000,
        salaryTo: 900000,
        skills: JSON.stringify(["Go", "PostgreSQL", "Redis", "gRPC", "Docker"]),
        companyId: kolesa.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "DevOps Engineer",
        description: "Поддержка Kubernetes-кластеров, CI/CD, мониторинг инфраструктуры Kolesa Group.",
        city: "Almaty",
        grade: "Middle",
        workFormat: "Hybrid",
        salaryFrom: 450000,
        salaryTo: 650000,
        skills: JSON.stringify(["Kubernetes", "Docker", "GitLab CI", "Prometheus", "Terraform"]),
        companyId: kolesa.id,
      },
    }),

    // Jusan jobs
    prisma.job.create({
      data: {
        title: "Android Developer",
        description: "Разработка Android-приложения Jusan с нуля. Kotlin, Jetpack Compose, Clean Architecture.",
        city: "Astana",
        grade: "Middle",
        workFormat: "Office",
        salaryFrom: 400000,
        salaryTo: 600000,
        skills: JSON.stringify(["Kotlin", "Jetpack Compose", "Android", "Clean Architecture", "Coroutines"]),
        companyId: jusan.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "Node.js Backend Developer",
        description: "Разработка API для банковских продуктов Jusan. Работа с финтех-сервисами и интеграциями.",
        city: "Astana",
        grade: "Middle",
        workFormat: "Hybrid",
        salaryFrom: 380000,
        salaryTo: 580000,
        skills: JSON.stringify(["Node.js", "TypeScript", "PostgreSQL", "REST API", "Docker"]),
        companyId: jusan.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "Junior Backend Developer",
        description: "Поддержка и разработка новых микросервисов. Хорошее введение в финтех-разработку.",
        city: "Astana",
        grade: "Junior",
        workFormat: "Office",
        salaryFrom: 220000,
        salaryTo: 320000,
        skills: JSON.stringify(["Java", "Spring", "SQL", "Git", "REST"]),
        companyId: jusan.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "QA Automation Engineer",
        description: "Автоматизация тестирования мобильных и веб-приложений Jusan Bank.",
        city: "Astana",
        grade: "Middle",
        workFormat: "Remote",
        salaryFrom: 350000,
        salaryTo: 500000,
        skills: JSON.stringify(["Selenium", "Appium", "Python", "pytest", "CI/CD"]),
        companyId: jusan.id,
      },
    }),

    // 2GIS jobs
    prisma.job.create({
      data: {
        title: "Frontend Developer (Vue.js)",
        description: "Разработка веб-интерфейса для картографической платформы 2GIS. Vue 3, TypeScript, WebGL.",
        city: "Almaty",
        grade: "Middle",
        workFormat: "Remote",
        salaryFrom: 420000,
        salaryTo: 620000,
        skills: JSON.stringify(["Vue.js", "TypeScript", "WebGL", "Maps API", "Git"]),
        companyId: gis.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "Python Backend Developer",
        description: "Разработка геосервисов и аналитических модулей. Работа с пространственными данными.",
        city: "Almaty",
        grade: "Senior",
        workFormat: "Hybrid",
        salaryFrom: 600000,
        salaryTo: 850000,
        skills: JSON.stringify(["Python", "FastAPI", "PostGIS", "PostgreSQL", "Docker"]),
        companyId: gis.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "Junior Python Developer",
        description: "Работа с геоданными, парсинг, скрипты для обработки карт. Отличный старт в геосервисах.",
        city: "Almaty",
        grade: "Junior",
        workFormat: "Remote",
        salaryFrom: 180000,
        salaryTo: 280000,
        skills: JSON.stringify(["Python", "SQL", "REST API", "Git", "Linux"]),
        companyId: gis.id,
      },
    }),

    // Samruk Digital jobs
    prisma.job.create({
      data: {
        title: "Full Stack Developer",
        description: "Разработка внутренних digital-продуктов для компаний Самрук-Казына. React + Node.js.",
        city: "Astana",
        grade: "Middle",
        workFormat: "Office",
        salaryFrom: 360000,
        salaryTo: 520000,
        skills: JSON.stringify(["React", "Node.js", "TypeScript", "PostgreSQL", "Docker"]),
        companyId: samruk.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "Senior Full Stack Developer",
        description: "Архитектура и разработка масштабируемых корпоративных систем. Тимлидинг, менторинг.",
        city: "Astana",
        grade: "Senior",
        workFormat: "Hybrid",
        salaryFrom: 650000,
        salaryTo: 950000,
        skills: JSON.stringify(["React", "Node.js", "TypeScript", "System Design", "Leadership"]),
        companyId: samruk.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "Junior Frontend Developer",
        description: "Участие в разработке государственных digital-продуктов. Обучение и рост в стабильной компании.",
        city: "Astana",
        grade: "Junior",
        workFormat: "Office",
        salaryFrom: 210000,
        salaryTo: 310000,
        skills: JSON.stringify(["HTML", "CSS", "JavaScript", "React", "Git"]),
        companyId: samruk.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "Backend Developer (Node.js) — Remote",
        description: "Удалённая разработка API-сервисов для Samruk Digital. Гибкий график, задачи уровня Middle.",
        city: "Remote",
        grade: "Middle",
        workFormat: "Remote",
        salaryFrom: 400000,
        salaryTo: 580000,
        skills: JSON.stringify(["Node.js", "Express", "PostgreSQL", "REST", "TypeScript"]),
        companyId: samruk.id,
      },
    }),
  ]);

  console.log(`✅ Seed completed: ${companies.length} companies, 20 jobs`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
