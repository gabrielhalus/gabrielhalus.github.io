/**
 * Remplit le CMS avec le contenu des maquettes (textes et placeholders « […] » à personnaliser).
 * Idempotent : les globals sont écrasés, les documents sont créés ou mis à jour par slug.
 *
 * Lancé par `pnpm seed`, et automatiquement au premier démarrage sur une base vide (payload.config.ts).
 */
import type { CollectionSlug, Payload } from 'payload'

import { block, h2, p, quote, root, table, text } from './lexical'

export async function seed(payload: Payload) {
  const upsert = async (collection: CollectionSlug, slug: string, data: Record<string, unknown>) => {
    const { docs } = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, draft: true })
    const payloadData = { ...data, slug, _status: 'published' } as never
    return docs[0]
      ? payload.update({ collection, id: docs[0].id, data: payloadData })
      : payload.create({ collection, data: payloadData })
  }

  /* ── Réglages ─────────────────────────────────────────────── */

  await payload.updateGlobal({
    slug: 'settings',
    data: {
      siteName: 'Gabriel Halus',
      siteUrl: 'https://gabrielhalus.com',
      defaultDescription:
        'Développeur freelance : applications web, automatisations et intégrations sur mesure, du premier appel à la mise en production.',
      role: 'Développeur',
      city: '[Ville]',
      authorBio:
        'Développeur freelance. Je conçois des outils qui retirent le travail administratif de la semaine des traiteurs et des petites entreprises.',
      availability: { show: true, text: 'Disponible à partir de [mois]' },
      email: 'contact@gabrielhalus.com',
      bookingUrl: 'https://cal.com/',
      responseTime: 'sous 48 h ouvrées',
      socials: [
        { label: 'GitHub', url: 'https://github.com/' },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/' },
        { label: 'Malt', url: 'https://www.malt.fr/' },
      ],
      legalName: 'Gabriel Halus, entrepreneur individuel (EI)',
      siret: '[000 000 000 00000]',
      address: '[Adresse postale]',
      registration: '[Registre national des entreprises]',
      vatMention: 'TVA non applicable, art. 293 B du CGI',
      footerCta: 'Un projet, ou un process qui vous coûte des heures chaque semaine ?',
      footerCtaLabel: 'Parlons-en',
      footerWordmark: 'gabrielhalus',
    },
  })

  /* ── Offre traiteurs ──────────────────────────────────────── */

  const traiteurs = await upsert('offers', 'traiteurs', {
    name: 'Traiteurs',
    status: 'live',
    order: 1,
    tone: 'blush',
    promise: '10 h gagnées par semaine',
    cardText: 'Devis, commandes, allergènes, relances : 10 h récupérées par semaine.',
    hero: {
      badge: 'Offre clé en main · prix fixe',
      title: 'Je fais gagner 10\u00a0h par semaine à votre activité de traiteur.',
      lead: 'Devis, commandes, fiches allergènes, relances d’acompte : un outil prêt à l’emploi, réglé sur votre carte et vos prix, installé en [X]\u00a0semaines.',
      primaryLabel: 'Calculer mon gain',
      secondaryLabel: 'Réserver une démo',
      trustPoints: [{ text: 'Sans changer vos habitudes' }, { text: 'Vos données restent à vous' }, { text: 'Audit d’1 h offert' }],
      imagePlaceholder: 'Photo : buffet ou cuisine d’un traiteur, lumière naturelle',
      floatingCards: {
        docLabel: 'Devis n° 0142',
        docTitle: 'Mariage · 120 couverts',
        docAmount: '6 840,00 €',
        docTime: 'en 3 min',
        timeLabel: 'Temps récupéré cette semaine',
        timeValue: '+ 10 h 15',
        notification: 'Fiche allergènes générée',
      },
    },
    problem: {
      title: 'Vous êtes traiteur. Pas secrétaire.',
      text: 'Chaque événement déclenche la même paperasse : chiffrer, recopier, vérifier les allergènes, relancer l’acompte. Ce sont des heures prises sur la cuisine, les clients ou le week-end.',
      breakdownTitle: 'Où partent 10 heures par semaine',
      breakdown: [
        { label: 'Devis & chiffrage', minutes: 240 },
        { label: 'Commandes, planning, listes de courses', minutes: 150 },
        { label: 'Acomptes, relances, factures', minutes: 120 },
        { label: 'Allergènes & étiquettes', minutes: 90 },
      ],
      footnote: 'Pour un traiteur gérant environ [8] événements par mois. Vos chiffres réels sont mesurés pendant l’audit.',
    },
    modules: {
      title: 'Quatre modules, un seul outil.',
      intro: 'Réglés sur votre carte, vos prix et vos modèles de documents. Utilisables sur ordinateur comme sur téléphone.',
      items: [
        {
          title: 'Devis en quelques clics',
          description: 'Choisissez les plats, le nombre de convives et les options : le devis PDF à vos couleurs est prêt à envoyer.',
          variant: 'accent',
          visual: 'glyph',
          glyph: '€',
        },
        {
          title: 'Commandes & production',
          description: 'Planning des événements, fiches de production et liste de courses calculées selon le nombre de couverts.',
          variant: 'light',
          visual: 'rows',
          visualItems: [
            { label: 'Sam. · Mariage Dupont', value: '120' },
            { label: 'Dim. · Séminaire', value: '45' },
          ],
        },
        {
          title: 'Allergènes & étiquettes',
          description: 'Les 14 allergènes réglementaires calculés à partir de vos recettes, fiches et étiquettes générées automatiquement.',
          variant: 'tone',
          visual: 'chips',
          visualItems: [{ label: 'Gluten' }, { label: 'Lait' }, { label: 'Fruits à coque' }, { label: '+ 11' }],
        },
        {
          title: 'Acomptes & relances',
          description: 'Les rappels partent tout seuls, les paiements sont suivis, l’export pour votre comptable est prêt.',
          variant: 'dark',
          visual: 'terminal',
          visualItems: [
            { label: 'J−30 · acompte 30 %', value: 'payé' },
            { label: 'J−7 · relance solde', value: 'envoyée' },
          ],
        },
      ],
    },
    pricing: {
      title: 'Une offre définie. Ajustée à votre maison.',
      intro: 'Le périmètre et le prix sont fixés avant de commencer. Vous savez ce que vous payez, et ce que vous récupérez.',
      plans: [
        {
          name: 'Essentiel',
          subtitle: 'Pour démarrer : devis & allergènes',
          price: '[PRIX] €',
          priceNote: 'HT, une fois',
          features: [{ text: 'Modules 01 et 03' }, { text: 'Votre carte et vos prix importés' }, { text: 'Livré en [X] semaines' }, { text: '1 h de formation' }],
          ctaLabel: 'Choisir Essentiel',
        },
        {
          name: 'Complet',
          subtitle: 'Les 4 modules, l’objectif 10 h',
          price: '[PRIX] €',
          priceNote: 'HT, une fois',
          highlighted: true,
          badge: 'Recommandé',
          features: [
            { text: 'Les 4 modules' },
            { text: 'Modèles de devis à vos couleurs' },
            { text: 'Livré en [X] semaines' },
            { text: 'Formation de l’équipe' },
            { text: 'Point à 30 jours : heures gagnées mesurées' },
          ],
          ctaLabel: 'Choisir Complet',
        },
        {
          name: 'Sur mesure',
          subtitle: 'Complet + vos besoins spécifiques',
          price: 'Sur devis',
          priceNote: '',
          features: [
            { text: 'Commande en ligne sur votre site' },
            { text: 'Connexion à votre logiciel de compta' },
            { text: 'Multi-sites, multi-équipes' },
            { text: 'Fonctions propres à votre activité' },
          ],
          ctaLabel: 'En parler',
        },
      ],
      footnote: 'Hébergement et maintenance : [PRIX] € HT / mois, sans engagement. TVA non applicable, art. 293 B du CGI.',
    },
    roi: {
      enabled: true,
      title: 'Combien d’heures récupérez-vous ?',
      intro: 'Ajustez avec vos chiffres. Le calcul suppose un devis ramené à 5 minutes et 60 % du temps d’administration par commande automatisé.',
      minutesPerQuoteAfter: 5,
      automationRate: 60,
      weeksPerYear: 46,
      ctaLabel: 'Vérifier ces chiffres lors d’un audit offert',
    },
    process: {
      title: 'De l’audit aux heures gagnées.',
      steps: [
        { when: 'Semaine 0', title: 'Audit offert', text: '1 h, chez vous ou en visio. On mesure où part réellement votre temps.' },
        { when: 'Semaine 1', title: 'Paramétrage', text: 'Votre carte, vos prix, vos recettes et vos modèles de documents sont intégrés.' },
        { when: 'Semaine [X]', title: 'Prise en main', text: 'Formation de l’équipe sur vos vrais événements. Rien à apprendre par cœur.' },
        { when: '+30 jours', title: 'Bilan chiffré', text: 'On compare le temps passé avant et après. Les heures gagnées sont mesurées, pas promises.' },
      ],
    },
    testimonial: {
      quote: '[Témoignage d’un traiteur client : ce qui a changé, en une ou deux phrases, idéalement avec un chiffre.]',
      author: '[Prénom Nom]',
      company: '[Maison] · [Ville]',
    },
    faq: [
      {
        question: 'Je ne suis pas à l’aise avec l’informatique. C’est pour moi ?',
        answer: 'Oui. L’outil est réglé pour vous avant la première utilisation et la formation se fait sur vos propres événements.',
      },
      { question: 'Dois-je abandonner mes outils actuels ?', answer: 'Non. On part de ce que vous utilisez déjà et on ne remplace que ce qui vous fait perdre du temps.' },
      { question: 'À qui appartiennent mes données ?', answer: 'À vous. Vous pouvez les exporter à tout moment, et elles sont hébergées en [Europe / France].' },
      {
        question: 'Mon activité a ses particularités.',
        answer: 'C’est prévu : la base est définie, les réglages sont les vôtres. Au-delà, la formule Sur mesure prend le relais.',
      },
      { question: 'Et après la livraison ?', answer: 'Un bilan à 30 jours, puis une maintenance mensuelle sans engagement si vous le souhaitez.' },
    ],
    finalCta: {
      title: 'Combien d’heures perdez-vous vraiment ?',
      text: 'Audit d’une heure, offert et sans engagement. Vous repartez avec vos chiffres, que vous travailliez avec moi ou non.',
      label: 'Réserver mon audit',
    },
  })

  await upsert('offers', 'prochain-metier', {
    name: '[Prochain métier]',
    status: 'soon',
    order: 2,
    tone: 'mint',
    cardText: 'Gabarit réutilisable',
    hero: { title: '[Prochain métier]' },
  })

  /* ── Accueil ──────────────────────────────────────────────── */

  await payload.updateGlobal({
    slug: 'home',
    data: {
      hero: {
        title: 'Je développe les outils qui font tourner',
        highlight: 'votre activité.',
        lead: 'Développeur freelance. Applications web, automatisations et intégrations sur mesure — du premier appel à la mise en production, avec une seule personne en face de vous.',
        primaryLabel: 'Réserver un appel',
        secondaryLabel: 'Voir les projets',
        tagline: 'Un seul interlocuteur, du début à la fin',
        tasksTitle: 'Cette nuit, Curso s’est occupé de :',
        tasks: [
          { icon: 'document', title: 'Devis · Mariage Dupont', detail: '120 couverts, envoyé au client', badge: 'Envoyé', badgeTone: 'done' },
          { icon: 'bell', title: 'Relance d’acompte', detail: 'Programmée automatiquement', badge: 'J−7', badgeTone: 'pending' },
          { icon: 'calendar', title: 'Planning de samedi', detail: 'Fiches et liste de courses', badge: 'Prêt', badgeTone: 'done' },
        ],
        featuredOffer: traiteurs.id,
      },
      clients: {
        title: 'Ils me font confiance',
        subtitle: 'Artisans, traiteurs, PME et indépendants',
        items: [
          { name: '[Client 1]', featured: true },
          { name: '[Client 2]', featured: true },
          { name: '[Client 3]', featured: true },
          { name: '[Client secondaire]', featured: false },
        ],
      },
      services: {
        title: 'Du code qui travaille',
        titleMuted: 'à votre place.',
        intro: 'Quatre façons de travailler ensemble. Toutes commencent par un appel de 30 minutes, gratuit.',
        items: [
          {
            title: 'Applications web sur mesure',
            description: 'Espace client, back-office, outil interne : une application pensée pour votre façon de travailler, pas l’inverse.',
            variant: 'accent',
            glyph: '{ }',
          },
          { title: 'Automatisations', description: 'Les copier-coller, relances et exports du quotidien deviennent des tâches qui tournent seules.', variant: 'light', glyph: '⟳' },
          { title: 'API & intégrations', description: 'Vos outils (compta, CRM, paiement, agenda) qui se parlent enfin, sans ressaisie.', variant: 'light', glyph: '⇄' },
          {
            title: 'Reprise & maintenance',
            description: 'Un projet existant à faire évoluer, sécuriser ou remettre d’aplomb. Audit, puis plan d’action chiffré.',
            variant: 'dark',
            glyph: '#',
          },
        ],
      },
      projects: {
        title: 'Projets récents',
        intro: 'Chaque ligne ouvre une étude de cas : le problème, ce qui a été construit, le résultat mesuré.',
      },
      method: {
        title: 'Un prix fixe, des démos régulières,',
        highlight: 'aucune surprise.',
        steps: [
          { title: 'Appel découverte', text: '30 minutes, gratuit. Vous décrivez le problème, je dis franchement si je suis la bonne personne.' },
          { title: 'Cadrage & devis', text: 'Périmètre écrit, délai et prix fixes. Vous savez exactement ce que vous achetez.' },
          { title: 'Développement', text: 'Par itérations courtes, avec une démo à chaque étape. Vous testez au fil de l’eau.' },
          { title: 'Livraison & suivi', text: 'Mise en ligne, documentation, prise en main. Maintenance proposée, jamais imposée.' },
        ],
      },
      offers: {
        title: 'Votre métier a déjà son offre clé en main.',
        intro: 'Un périmètre défini, un prix connu d’avance, un gain de temps chiffré. Personnalisable, mais livré vite parce qu’il est déjà pensé pour vous.',
        tags: ['Offre finie', 'Prix fixe', 'ROI chiffré'],
      },
      tools: { title: 'Outils du quotidien', items: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', '[outil]', '[outil 2]'] },
    },
  })

  /* ── Projets ──────────────────────────────────────────────── */

  const projects = [
    { n: 1, type: 'web-app', year: 2026, tone: 'slate', highlight: true },
    { n: 2, type: 'automation', year: 2026, tone: 'mint' },
    { n: 3, type: 'api', year: 2025, tone: 'lilac' },
    { n: 4, type: 'takeover', year: 2025, tone: 'blush' },
  ]
  for (const pr of projects) {
    await upsert('projects', `projet-${pr.n}`, {
      title: `[Nom du projet ${pr.n}]`,
      projectType: pr.type,
      sector: '[secteur]',
      year: pr.year,
      client: '[Client]',
      result: pr.n === 1 ? '[Résultat mesuré, ex. « −40 % de temps de saisie »]' : '[Résultat mesuré]',
      summary: '[Le problème du client en une ou deux phrases, et ce qui a été construit.]',
      tone: pr.tone,
      featured: pr.n <= 3,
      highlightSector: Boolean(pr.highlight),
      order: pr.n,
      stack: ['TypeScript', '[outil]'],
      content: root(
        h2('Le problème'),
        p('[Contexte du client, ce qui coûtait du temps ou de l’argent.]'),
        h2('Ce qui a été construit'),
        p('[Les choix techniques, expliqués simplement.]'),
        h2('Le résultat'),
        p('[Le résultat mesuré, avec un chiffre.]'),
      ),
    })
  }

  /* ── Guide ────────────────────────────────────────────────── */

  await upsert('guides', 'devis-traiteur', {
    title: 'Devis traiteur : comment le rédiger en 5 minutes, sans rien oublier',
    lead: 'Les mentions à faire figurer, la structure qui rassure le client, et une méthode pour arrêter de recopier les mêmes lignes à chaque événement.',
    category: 'Guide pratique',
    tags: ['Traiteurs', 'Gestion'],
    tone: 'blush',
    offer: traiteurs.id,
    publishedAt: new Date().toISOString(),
    showToc: true,
    tldr: [
      { text: 'Un devis traiteur doit être daté, détaillé ligne par ligne et indiquer sa durée de validité.' },
      { text: 'Les allergènes des plats proposés doivent pouvoir être communiqués au client.' },
      { text: 'Partir d’une carte chiffrée et d’un nombre de convives suffit à générer 90 % du devis.' },
    ],
    intro:
      'Un mariage, un séminaire, un cocktail : à chaque demande, le même rituel. Ouvrir l’ancien devis, changer le nom, recalculer les quantités, vérifier les prix. Ce guide pose une structure claire, puis montre comment ne plus la refaire à la main.',
    content: root(
      h2('Les mentions à faire figurer'),
      p('Un devis engage les deux parties une fois signé. Il doit permettre au client de savoir exactement ce qu’il achète, et à vous de facturer sans discussion.'),
      block('checklist', {
        items: [
          { text: 'Date du devis et durée de validité de l’offre' },
          { text: 'Vos coordonnées, SIRET, et celles du client' },
          { text: 'Date, lieu et nombre de convives de l’événement' },
          { text: 'Le détail des prestations : quantité, prix unitaire, total' },
          { text: 'Totaux HT, TVA et TTC, ou la mention d’exonération' },
          { text: 'Conditions de paiement : acompte, solde, échéances' },
        ],
      }),
      block('callout', {
        title: 'Bon à savoir.',
        text: 'Les règles exactes dépendent de votre statut et de votre régime de TVA. Faites valider votre modèle une fois par votre expert-comptable : ensuite, il ne bouge plus.',
      }),
      h2('Une structure qui rassure'),
      p('Le client compare souvent plusieurs devis. Celui qui se lit en trente secondes a un avantage. Regroupez les lignes par moment du repas plutôt que par ingrédient :'),
      table([
        ['Section', 'Contenu', 'Total HT'],
        ['Cocktail', '8 pièces salées par personne', '[000,00 €]'],
        ['Dîner', 'Entrée, plat, dessert', '[000,00 €]'],
        ['Service', 'Personnel, vaisselle, livraison', '[000,00 €]'],
      ]),
      h2('Les allergènes, dès le devis'),
      p('La réglementation européenne liste 14 allergènes à déclarer. Les indiquer dès le devis évite les allers-retours, et montre au client que le sujet est maîtrisé.'),
      block('figure', {
        placeholder: 'Illustration : extrait de devis avec pastilles allergènes — texte alternatif descriptif',
        caption: 'Chaque plat porte ses allergènes, calculés à partir de la recette.',
      }),
      block('offerCta', {
        eyebrow: 'Offre traiteurs',
        text: 'Et si tout ça se faisait tout seul ? Devis, allergènes, relances : 10 h gagnées par semaine.',
        label: 'Calculer mon gain',
        url: '/traiteurs#roi',
      }),
      h2('La méthode en 4 étapes'),
      block('steps', {
        items: [
          { title: 'Chiffrez votre carte une fois.', text: 'Chaque plat a un prix par personne et sa liste d’allergènes.' },
          { title: 'Créez trois formules types.', text: 'Cocktail, repas assis, buffet : elles couvrent la majorité des demandes.' },
          { title: 'Ajustez au lieu de réécrire.', text: 'Nombre de convives, options, livraison : le reste se recalcule.' },
          { title: 'Planifiez la relance.', text: 'Sans réponse à J+7, un rappel poli part. C’est souvent lui qui déclenche la signature.' },
        ],
      }),
      quote('Le meilleur devis est celui qu’on n’a pas eu à taper.'),
      p(text('Ce guide est un exemple : '), text('remplacez-le par votre propre contenu.', true)),
    ),
    faq: [
      { question: 'Un devis traiteur est-il payant ?', answer: 'C’est à vous de le décider. Si vous le facturez, indiquez-le avant de l’établir.' },
      {
        question: 'Combien de temps un devis reste-t-il valable ?',
        answer: 'La durée que vous indiquez. Un mois est courant : assez pour décider, assez court pour vos prix matières.',
      },
      { question: 'Quel acompte demander ?', answer: 'Il n’y a pas de règle unique. Fixez-le dans vos conditions et rappelez-le sur chaque devis.' },
    ],
  })

  /* ── Contact, légal, cookies ──────────────────────────────── */

  await payload.updateGlobal({
    slug: 'contact-page',
    data: {
      title: 'Parlons de votre projet.',
      lead: 'Décrivez votre besoin en quelques lignes. Je vous réponds {delai}, avec une première idée de la solution et du budget.',
      bookingTitle: 'Réserver un appel',
      bookingText: '30 min en visio, gratuit · [lien agenda]',
      mailTitle: 'Écrire directement',
      messagePlaceholder: 'Le contexte, ce qui vous fait perdre du temps, l’échéance éventuelle…',
      budgets: ['Je ne sais pas encore', '[Fourchette 1]', '[Fourchette 2]', '[Fourchette 3]'],
      formNote: 'Pas de newsletter, pas de revente.',
      success: {
        title: 'Message bien reçu.',
        text: 'Merci ! Je reviens vers vous {delai}. Une copie de votre message vient de partir dans votre boîte mail.',
      },
      stepsTitle: 'Ce qui se passe après l’envoi',
      steps: [
        { title: 'Je lis tout', text: 'Une réponse personnelle, pas un message automatique.' },
        { title: 'Un appel de 30 min', text: 'Pour comprendre le besoin et vérifier qu’on est faits pour travailler ensemble.' },
        { title: 'Une proposition écrite', text: 'Périmètre, délai, prix fixe. Vous décidez à tête reposée.' },
      ],
    },
  })

  await payload.updateGlobal({
    slug: 'legal',
    data: {
      publisher: 'Gabriel Halus',
      hosting: 'Le site est hébergé par [Nom de l’hébergeur], [raison sociale], [adresse], [téléphone].',
      intellectualProperty:
        'L’ensemble des contenus du site (textes, visuels, code, logo) est la propriété de Gabriel Halus, sauf mention contraire. Toute reproduction sans autorisation écrite est interdite. Les projets présentés le sont avec l’accord des clients concernés.',
      privacy: {
        intro: 'Le responsable du traitement est Gabriel Halus. Les seules données collectées sont celles que vous saisissez dans le formulaire de contact.',
        rows: [
          { label: 'Données', detail: 'Nom, e-mail, entreprise et téléphone (facultatifs), message' },
          { label: 'Finalité', detail: 'Répondre à votre demande et, le cas échéant, établir une proposition' },
          { label: 'Base légale', detail: 'Votre consentement et les mesures précontractuelles prises à votre demande' },
          { label: 'Conservation', detail: '[3 ans] à compter du dernier échange' },
          { label: 'Destinataires', detail: 'Gabriel Halus uniquement ; prestataires techniques : [hébergeur], [service d’envoi d’e-mails]' },
        ],
        rights:
          'Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition, de limitation et de portabilité. Écrivez à contact@gabrielhalus.com ; réponse sous un mois. En cas de désaccord, vous pouvez saisir la CNIL.',
      },
    },
  })

  await payload.updateGlobal({
    slug: 'cookies',
    data: {
      title: 'Le strict minimum, et c’est vous qui choisissez.',
      intro:
        'Ce site n’utilise aucun cookie publicitaire. Les seuls traceurs servent à faire fonctionner le site et, si vous l’acceptez, à mesurer sa fréquentation.',
      categories: {
        necessary: 'Mémorisent votre choix sur cette page. Toujours actifs.',
        analytics: '[Outil d’analyse] — pages vues et provenance, sans profilage. Conservés [13 mois] maximum.',
        thirdParty: 'Agenda de prise de rendez-vous [outil] intégré à la page Contact.',
      },
      trackers: [
        { name: 'gh_consent', category: 'necessary', purpose: 'Mémoriser vos choix de cookies', duration: '6 mois' },
        { name: '[nom_cookie]', category: 'analytics', purpose: 'Statistiques de fréquentation anonymes', duration: '[13 mois]' },
        { name: '[nom_cookie]', category: 'thirdParty', purpose: 'Affichage de l’agenda de prise de rendez-vous', duration: '[durée]' },
      ],
      footnote:
        'Refuser n’empêche pas d’utiliser le site. Vous pouvez changer d’avis à tout moment depuis cette page ou le lien « Cookies » en pied de page.',
      banner: {
        title: 'Un petit réglage',
        text: 'J’aimerais mesurer la fréquentation du site, sans publicité ni revente. D’accord ?',
      },
    },
  })

  /* ── QR codes ─────────────────────────────────────────────── */

  const card = await payload.find({ collection: 'qr-codes', where: { code: { equals: 'nqwrsv' } }, limit: 1 })
  if (!card.docs.length) {
    await payload.create({ collection: 'qr-codes', data: { label: 'Cartes de visite', code: 'nqwrsv', destination: '/', active: true } })
  }

  payload.logger.info('Seed terminé ✓')
}
