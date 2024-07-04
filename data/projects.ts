import Project from '@/types/project';
import { BicepsFlexed, Brain, ToyBrick } from 'lucide-react';

export const PROJECTS: Record<'en' | 'fr', Project[]> = {
  en: [
    {
      Icon: BicepsFlexed,
      title: 'Trekha',
      slug: 'trekha',
      shortDescription: 'A collaborative Pomodoro timer with social features.',
      longDescription:
        '"Trekha" is an innovative application that combines the famous Pomodoro timer with social features to offer a collaborative productivity experience. Designed to help users maximize their efficiency while staying connected with colleagues, friends, or community members, Trekha transforms individual work into a social and motivating activity.',
      image: '/images/trekha.png',
      repo: 'https://github.com/trekha-com/',
    },
    {
      Icon: Brain,
      title: 'Paperlive',
      slug: 'paperlive',
      shortDescription: 'A platform for tracking and analyzing research paper metrics.',
      longDescription:
        '"Paperlive" is an innovative platform designed for tracking and analyzing research paper metrics. This application allows researchers, academics, and institutions to monitor the performance of their publications in real-time, providing valuable insights to enhance the visibility and impact of their scientific work.',
      image: '/images/paperlive.png',
      url: 'http://demo.paperlive.gabrielhalus.com/',
      repo: 'https://github.com/gabrielhalus/paperlive.git/',
    },
    {
      Icon: ToyBrick,
      title: "Let's go Lego",
      slug: 'letsgo-lego',
      shortDescription: 'An e-auction site focused on LEGO products.',
      longDescription:
        '"Let\'s go Lego" is an e-auction site specially designed for LEGO enthusiasts. This project was developed as part of my training to practice and perfect my web development skills. Our platform offers a variety of LEGO products, ranging from classic sets to limited editions, including rare collector pieces. Users can sign up, bid on their favorite items, and track their bids in real-time, thanks to an intuitive and user-friendly interface. To realize this project, we used the MERN technology stack, consisting of MongoDB, Express.js, React, and Node.js.',
      image: '/images/letsgo-lego.png',
    },
  ],
  fr: [
    {
      Icon: BicepsFlexed,
      title: 'Trekha',
      slug: 'trekha',
      shortDescription: 'Un minuteur Pomodoro collaboratif avec des fonctions sociales.',
      longDescription:
        '"Trekha" est une application innovante qui combine le célèbre minuteur Pomodoro avec des fonctionnalités sociales pour offrir une expérience de productivité collaborative. Conçue pour aider les utilisateurs à maximiser leur efficacité tout en restant connectés avec leurs collègues, amis ou membres de leur communauté, Trekha transforme le travail individuel en une activité sociale et motivante.',
      image: '/images/trekha.png',
      repo: 'https://github.com/trekha-com/',
    },
    {
      Icon: Brain,
      title: 'Paperlive',
      slug: 'paperlive',
      shortDescription: "Une plateforme pour le suivi et l'analyse des métriques des articles de recherche.",
      longDescription:
        '"Paperlive" est une plateforme innovante conçue pour le suivi et l\'analyse des métriques des articles de recherche. Cette application permet aux chercheurs, aux universitaires et aux institutions de suivre les performances de leurs publications en temps réel, offrant ainsi des insights précieux pour améliorer la visibilité et l\'impact de leurs travaux scientifiques.',
      image: '/images/paperlive.png',
      url: 'http://demo.paperlive.gabrielhalus.com/',
      repo: 'https://github.com/gabrielhalus/paperlive.git/',
    },
    {
      Icon: ToyBrick,
      title: "Let's go Lego",
      slug: 'letsgo-lego',
      shortDescription: "Un site d'enchères électroniques axé sur les produits LEGO.",
      longDescription:
        "\"Let's go Lego\" est un site d'enchères électroniques spécialement conçu pour les passionnés de LEGO. Ce projet a été développé dans le cadre de ma formation afin de mettre en pratique et de perfectionner mes compétences en développement web.\nNotre plateforme propose une variété de produits LEGO, allant des ensembles classiques aux éditions limitées, en passant par des pièces de collection rares. Les utilisateurs peuvent s'inscrire, enchérir sur leurs articles favoris, et suivre leurs enchères en temps réel, grâce à une interface utilisateur intuitive et conviviale.\nPour réaliser ce projet, nous avons utilisé la pile de technologies MERN, composée de MongoDB, Express.js, React, et Node.js",
      image: '/images/letsgo-lego.png',
    },
  ],
};
