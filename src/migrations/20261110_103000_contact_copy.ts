import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.updateGlobal({
    slug: 'contact-page',
    req,
    data: {
      title: 'Parlez-moi de votre projet.',
      lead: 'Vous avez une idée précise ou simplement un problème que vous aimeriez résoudre ? Expliquez-moi votre besoin en quelques lignes. Je vous réponds personnellement {delai} pour discuter des possibilités et des prochaines étapes.',
      bookingTitle: 'Réserver un appel de 30 minutes',
      bookingText: 'Gratuit, sans engagement, directement avec moi',
      messagePlaceholder:
        'Que souhaitez-vous créer ou améliorer ? Comment travaillez-vous aujourd’hui ? Qu’est-ce qui vous pose problème ? Quelques phrases suffisent.',
      budgets: ['Je ne sais pas encore', '1 000 à 2 000 €', '2 000 à 5 000 €', 'Plus de 5 000 €'],
      formNote: 'Je vous réponds {delai}. Vos coordonnées servent uniquement à donner suite à votre demande.',
      stepsTitle: 'Comment se passe la suite ?',
      steps: [
        { title: 'Je prends connaissance de votre besoin', text: 'Je lis votre message et reviens vers vous pour préciser les premiers éléments si nécessaire.' },
        { title: 'Nous en discutons', text: 'Un appel permet de comprendre votre fonctionnement, vos priorités et les contraintes du projet.' },
        { title: 'Vous recevez une proposition', text: 'Si je peux vous accompagner, je prépare un devis détaillé avec le périmètre, le délai et le budget.' },
      ],
    },
  })
}

export async function down({}: MigrateDownArgs): Promise<void> {}
