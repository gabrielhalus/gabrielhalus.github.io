import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" ADD COLUMN "about_title" varchar;
  ALTER TABLE "home" ADD COLUMN "about_text" varchar;
  ALTER TABLE "home" ADD COLUMN "final_cta_title" varchar;
  ALTER TABLE "home" ADD COLUMN "final_cta_text" varchar;
  ALTER TABLE "home" ADD COLUMN "final_cta_label" varchar;
  ALTER TABLE "home" ADD COLUMN "final_cta_note" varchar;`)

  await payload.updateGlobal({
    slug: 'home',
    req,
    data: {
      about: {
        title: 'Un développeur à qui vous pouvez expliquer votre métier.',
        text: 'Je suis Gabriel Halus, développeur indépendant à Grenoble. Je travaille avec des entreprises et des équipes qui ont besoin d’outils adaptés à leur activité. Mon rôle commence par comprendre comment vous travaillez aujourd’hui, ce qui vous ralentit et ce que vous aimeriez améliorer.\n\nJe prends ensuite en charge la conception, le développement et la mise en service de la solution.\n\nVous échangez directement avec la personne qui développe votre projet. C’est plus simple pour poser vos questions, faire avancer les décisions et garder une vision claire du travail réalisé.',
      },
      finalCta: {
        title: 'Vous avez une idée de projet ? Parlons-en.',
        text: 'Un outil à créer, des tâches à automatiser ou une application à faire évoluer ? Présentez-moi votre besoin pendant un appel de 30 minutes. Nous verrons ce qui est possible, les points à prévoir et comment avancer.',
        label: 'Réserver un appel gratuit',
        note: '30 minutes en visio. Sans engagement. Échange direct avec moi.',
      },
    },
  })
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" DROP COLUMN "about_title";
  ALTER TABLE "home" DROP COLUMN "about_text";
  ALTER TABLE "home" DROP COLUMN "final_cta_title";
  ALTER TABLE "home" DROP COLUMN "final_cta_text";
  ALTER TABLE "home" DROP COLUMN "final_cta_label";
  ALTER TABLE "home" DROP COLUMN "final_cta_note";`)
}
