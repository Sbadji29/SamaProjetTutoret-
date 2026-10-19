const fs = require('fs');
const path = require('path');
const docxPath = path.join(__dirname, 'frontend', 'projet-tutores', 'node_modules', 'docx');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  ImageRun,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  PageBreak,
  ShadingType
} = require(docxPath);

const IMG_DIR = 'C:/Users/bmd/.gemini/antigravity-ide/brain/90491588-db26-4f9c-89b7-700810eda956/.user_uploaded/';
const OUTPUT_FILE = path.join(__dirname, 'Rapport_Projet_Tutores_M2_GDIL.docx');

function safeReadImage(filename) {
  const fullPath = path.join(IMG_DIR, filename);
  if (fs.existsSync(fullPath)) {
    return fs.readFileSync(fullPath);
  }
  return null;
}

function makeTitle(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120 }
  });
}

function makeH1(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 140 }
  });
}

function makeH2(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 100 }
  });
}

function makeH3(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80 }
  });
}

function makeP(text, options = {}) {
  return new Paragraph({
    alignment: options.align || AlignmentType.JUSTIFIED,
    spacing: { before: options.before || 60, after: options.after || 100, line: 276 },
    children: [
      new TextRun({
        text: text,
        bold: !!options.bold,
        italics: !!options.italic,
        size: options.size || 22,
        color: options.color || "2D3748"
      })
    ]
  });
}

function makeBullet(text, boldPrefix = "") {
  const runs = [];
  if (boldPrefix) {
    runs.push(new TextRun({ text: boldPrefix + " ", bold: true, size: 22, color: "1A202C" }));
  }
  runs.push(new TextRun({ text: text, size: 22, color: "2D3748" }));
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 60, line: 260 },
    children: runs
  });
}

function makeCaption(figureNum, title) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 180 },
    children: [
      new TextRun({ text: `Figure ${figureNum} : `, bold: true, italics: true, size: 19, color: "1B5E20" }),
      new TextRun({ text: title, italics: true, size: 19, color: "4A5568" })
    ]
  });
}

function makeImageParagraph(buffer, width = 560, height = 350) {
  if (!buffer) return makeP("[Image non disponible]");
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 60 },
    children: [
      new ImageRun({
        data: buffer,
        transformation: {
          width: width,
          height: height
        }
      })
    ]
  });
}

function makeStyledTable(headers, rows) {
  const headerCells = headers.map(h => new TableCell({
    shading: { type: ShadingType.CLEAR, fill: "1B5E20" },
    margins: { top: 120, bottom: 120, left: 140, right: 140 },
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: h, bold: true, color: "FFFFFF", size: 20 })]
    })]
  }));

  const tableRows = [new TableRow({ children: headerCells })];

  rows.forEach((r, idx) => {
    const bgFill = idx % 2 === 0 ? "F7FAFC" : "FFFFFF";
    const cells = r.map((c, cellIdx) => new TableCell({
      shading: { type: ShadingType.CLEAR, fill: bgFill },
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      children: [new Paragraph({
        alignment: cellIdx === 0 ? AlignmentType.LEFT : AlignmentType.LEFT,
        children: [new TextRun({ text: c, size: 19, color: "2D3748" })]
      })]
    }));
    tableRows.push(new TableRow({ children: cells }));
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows
  });
}

async function buildDoc() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 22,
            color: "2D3748"
          }
        }
      },
      heading1: {
        run: {
          font: "Calibri",
          size: 32,
          bold: true,
          color: "1B5E20"
        }
      },
      heading2: {
        run: {
          font: "Calibri",
          size: 26,
          bold: true,
          color: "2E7D32"
        }
      },
      heading3: {
        run: {
          font: "Calibri",
          size: 23,
          bold: true,
          color: "388E3C"
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: "Master 2 GDIL — Projet Pratique Multi-Tiers : UniProjet", italics: true, size: 18, color: "718096" })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "Page ", size: 18, color: "718096" }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "718096" }),
                  new TextRun({ text: " / ", size: 18, color: "718096" }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: "718096" })
                ]
              })
            ]
          })
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({ text: "RÉPUBLIQUE DU SÉNÉGAL", bold: true, size: 24, color: "1A202C" })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 60 },
            children: [
              new TextRun({ text: "UNIVERSITÉ GASTON BERGER DE SAINT-LOUIS (UGB)", bold: true, size: 26, color: "1B5E20" })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 300 },
            children: [
              new TextRun({ text: "UFR des Sciences Appliquées et de Technologie (UFR SAT)\nDépartement Informatique", bold: false, size: 22, color: "4A5568" })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 100 },
            children: [
              new TextRun({ text: "RAPPORT DE PROJET PRATIQUE", bold: true, size: 36, color: "1B5E20" })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 200 },
            children: [
              new TextRun({ text: "DÉVELOPPEMENT D'APPLICATIONS MULTI-TIERS", bold: true, size: 26, color: "2D3748" })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 400 },
            children: [
              new TextRun({ text: "Sujet : Conception et Développement d'une Application Web de Gestion des Projets Tutorés (« UniProjet »)", italics: true, size: 24, color: "2E7D32" })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 100 },
            children: [
              new TextRun({ text: "Filière : Master 2 Génie du Développement Informatique et Logiciel (GDIL)", bold: true, size: 22, color: "1A202C" })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 60 },
            children: [
              new TextRun({ text: "Session Académique : 2024 - 2025", size: 22, color: "4A5568" })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 500 },
            children: [
              new TextRun({ text: "Cadre d'évaluation : Évaluation sommative sur plateforme logicielle de bout en bout", italics: true, size: 20, color: "718096" })
            ]
          }),
          new Paragraph({ children: [new PageBreak()] }),

          makeH1("Fiche Synthétique & Résumé Exécutif"),
          makeP("Ce rapport technique formalise la conception, la modélisation et la réalisation logicielle complète de la plateforme web académique UniProjet, dédiée à la gestion intégrale du cycle de vie des projets tutorés au sein de l'Université Gaston Berger (UGB)."),
          makeP("Conformément au cahier des charges du Master 2 GDIL, la solution respecte rigoureusement une séparation stricte des couches dans le cadre d'une architecture multi-tiers (3-Tiers) :"),
          makeBullet("Couche Présentation (Frontend) : Application Single Page (SPA) développée sous le framework Angular, s'appuyant sur des composants autonomes (Standalone Components), Bootstrap 5, un design épuré, réactif et adapté aux différents rôles.", "•"),
          makeBullet("Couche Logique Métier (Backend) : API RESTful JSON articulée autour du framework Spring Boot 3 et de services applicatifs garantissant les règles d'intégrité métier (unicité de candidature, contrôle des quotas d'encadrement, arbitrage collégial).", "•"),
          makeBullet("Couche Persistance (Données) : Mapping objet-relationnel fondé sur Spring Data JPA et Hibernate, adossé à un système de gestion de base de données relationnelle MySQL normalisé.", "•"),
          makeBullet("Sécurité & Authentification : Mécanisme de hachage de mot de passe renforcé par PBKDF2 avec sel cryptographique aléatoire de 128 bits et 65 536 itérations, doublé d'un contrôle d'accès basé sur les rôles (RBAC).", "•"),
          makeP("Mots-clés : Architecture 3-Tiers, Angular, Spring Boot 3, Spring Data JPA, REST API, PBKDF2, Projets Tutorés, Arbitrage Pédagogique, UGB Saint-Louis."),

          makeH1("Chapitre 1 : Analyse des Besoins et Spécifications Fonctionnelles"),
          makeH2("1.1 Contexte et Problématique"),
          makeP("Chaque année universitaire, l'organisation des projets tutorés représente une charge administrative et pédagogique considérable pour le département informatique. Les démarches traditionnelles (formulaires papier, échanges d'e-mails dispersés, fichiers tableurs non synchronisés) engendrent de multiples difficultés :"),
          makeBullet("Perte d'informations et redondance des dépôts de sujets par les enseignants-chercheurs.", "•"),
          makeBullet("Opacité dans le suivi des candidatures et sentiments d'arbitraire chez les étudiants.", "•"),
          makeBullet("Dépassement involontaire des quotas d'encadrement par laboratoire ou encadrant.", "•"),
          makeBullet("Complexité extrême pour la Commission Pédagogique lors de la phase d'arbitrage et d'affectation définitive des binômes.", "•"),
          makeP("L'application UniProjet répond à cette problématique en fournissant une solution unifiée, collaborative, réactive et sécurisée."),

          makeH2("1.2 Identification des Acteurs et Rôles"),
          makeP("Le système identifie quatre acteurs fondamentaux avec des périmètres fonctionnels distincts :"),
          makeStyledTable(
            ["Rôle", "Acteur", "Responsabilités et Actions Clés"],
            [
              ["ETUDIANT", "Étudiant inscrit en M2", "Consulter le catalogue des sujets disponibles, postuler avec vœu motivé, suivre l'état de validation de ses candidatures, consulter son affectation finale."],
              ["ENSEIGNANT", "Enseignant-Chercheur / Tuteur", "Proposer de nouveaux sujets de recherche/développement, éditer ou retirer ses sujets, consulter les dossiers des candidats et émettre un avis d'encadrement."],
              ["RESPONSABLE", "Responsable Pédagogique / Commission", "Consulter l'ensemble des vœux, arbitrer collégialement les candidatures (Accepter / Rejeter), veiller au strict respect des quotas et affecter définitivement les étudiants."],
              ["ADMIN", "Administrateur Système / ENT", "Gérer l'annuaire des étudiants et enseignants, superviser la campagne, configurer les sessions universitaires et auditer les accès système."]
            ]
          ),

          makeH2("1.3 Règles Métier Obligatoires"),
          makeP("Pour satisfaire les exigences formelles énoncées dans le sujet pratique, la couche métier du backend implémente cinq règles de gestion cardinales :"),
          makeBullet("Règle RM-01 (Candidature unique) : Un étudiant ne peut postuler qu'une seule fois à un même sujet de projet tutoré. Toute tentative de doublon déclenche une exception HTTP 400 (Bad Request).", "1."),
          makeBullet("Règle RM-02 (Disponibilité stricte) : Seuls les sujets dont le statut est explicitement 'DISPONIBLE' peuvent recevoir de nouvelles candidatures. Un sujet marqué 'COMPLET' est verrouillé.", "2."),
          makeBullet("Règle RM-03 (Machine à états des candidatures) : Toute nouvelle candidature naît au statut 'EN_ATTENTE'. Seul le responsable pédagogique peut la faire transiter vers 'ACCEPTEE' ou 'REJETEE'.", "3."),
          makeBullet("Règle RM-04 (Plafond de capacité d'accueil) : Chaque sujet définit une capacité maximale d'accueil (ex: 2 à 3 étudiants). Dès que le nombre de candidatures acceptées atteint ce plafond, le sujet passe automatiquement en statut 'COMPLET'.", "4."),
          makeBullet("Règle RM-05 (Affectation définitive automatique) : Lorsqu'une candidature est acceptée par la commission, une instance d'affectation officielle est automatiquement créée et liée à l'étudiant et au sujet.", "5."),

          makeH1("Chapitre 2 : Architecture Multi-Tiers et Conception Technique"),
          makeH2("2.1 Vue d'Ensemble de l'Architecture 3-Tiers"),
          makeP("L'architecture retenue répond aux standards industriels du génie logiciel :"),
          makeBullet("Tier 1 - Niveau Présentation (Client Web) : Développé avec Angular (mode Standalone Components). Il consomme les points de terminaison REST du backend de manière asynchrone via HttpClient (avec fetch). Aucune logique métier critique n'est exécutée côté client.", "•"),
          makeBullet("Tier 2 - Niveau Applicatif et Métier (Serveur REST) : Conçu avec Spring Boot 3. Les contrôleurs REST (@RestController) réceptionnent les requêtes JSON, les valident, et délèguent le traitement aux services métier (@Service). Les transactions et règles de cohérence sont protégées par @Transactional.", "•"),
          makeBullet("Tier 3 - Niveau Persistance (Base de Données) : Assuré par Spring Data JPA et Hibernate, dialoguant avec une base MySQL via JDBC. Les entités gèrent les relations d'héritage et d'association avec intégrité référentielle stricte.", "•"),

          makeH2("2.2 Modèle Conceptuel et Diagramme de Classes UML"),
          makeP("Le modèle objet a été conçu pour refléter fidèlement le domaine universitaire :"),
          makeBullet("Utilisateur (Classe abstraite / Entité racine) : Identifiant, nom, prénom, email universitaire unique, mot de passe hashé, rôle (RoleUtilisateur).", "•"),
          makeBullet("Etudiant (Hérite d'Utilisateur) : Numéro étudiant (ex: 22104981), promotion, liste de ses candidatures et affectations.", "•"),
          makeBullet("Enseignant (Hérite d'Utilisateur) : Grade/Titre, département, laboratoire de recherche (ex: LIRIS, CRAN), quota d'encadrement, sujets proposés.", "•"),
          makeBullet("ResponsablePedagogique (Hérite d'Utilisateur) : Département rattaché, habilitation d'arbitrage de session.", "•"),
          makeBullet("Administrateur (Hérite d'Utilisateur) : Direction informatique, droits de maintenance et configuration globale.", "•"),
          makeBullet("Sujet : Titre, description détaillée, mots-clés technologiques, capacité maximale, statut (DISPONIBLE, COMPLET, ARCHIVE), référence vers l'enseignant encadrant et la session universitaire.", "•"),
          makeBullet("Candidature : Références vers l'étudiant et le sujet visé, date de dépôt, lettre de motivation, statut (EN_ATTENTE, ACCEPTEE, REJETEE), avis de l'encadrant.", "•"),
          makeBullet("Affectation : Matérialise l'affectation finale validée par le jury, date d'affectation, statut et session associée.", "•"),

          makeH2("2.3 Conception des Points de Terminaison de l'API RESTful"),
          makeP("L'ensemble des échanges entre le frontend Angular et le backend Spring Boot s'effectue au format JSON selon les conventions REST :"),
          makeStyledTable(
            ["Méthode", "Endpoint REST", "Description & Règles Associées"],
            [
              ["POST", "/api/utilisateurs/connexion", "Authentification de l'utilisateur par email/mot de passe avec vérification PBKDF2."],
              ["POST", "/api/utilisateurs/inscription", "Création d'un nouveau compte (étudiant ou enseignant) avec détection de rôle."],
              ["GET", "/api/sujets", "Récupération de la liste de tous les sujets de projets tutorés."],
              ["GET", "/api/sujets/disponibles", "Récupération des sujets ouverts aux candidatures (capacité restante > 0)."],
              ["POST", "/api/sujets", "Création d'un nouveau sujet de projet tutoré par un enseignant."],
              ["PUT", "/api/sujets/{id}", "Modification d'un sujet (titre, description, capacité, statut)."],
              ["DELETE", "/api/sujets/{id}", "Suppression d'un sujet de projet tutoré."],
              ["GET", "/api/candidatures", "Consultation de toutes les candidatures pour arbitrage."],
              ["POST", "/api/candidatures", "Dépôt d'une candidature par un étudiant (vérification candidature unique)."],
              ["PUT", "/api/candidatures/{id}/statut", "Mise à jour du statut (arbitrage : ACCEPTEE ou REJETEE) et calcul des quotas."],
              ["GET", "/api/affectations", "Consultation du registre synthétique des affectations confirmées."]
            ]
          ),

          makeH2("2.4 Architecture de Sécurité et Chiffrement PBKDF2"),
          makeP("Contrairement aux implémentations simplistes qui stockent les mots de passe en clair ou avec des fonctions de hachage obsolètes (MD5, SHA-1), UniProjet intègre la classe SecuriteUtilitaire qui implémente la norme PBKDF2 (Password-Based Key Derivation Function 2) :"),
          makeBullet("Algorithme sous-jacent : PBKDF2WithHmacSHA256.", "•"),
          makeBullet("Sel cryptographique : Sel pseudo-aléatoire de 16 octets (128 bits) généré via SecureRandom pour chaque mot de passe.", "•"),
          makeBullet("Facteur d'itération : 65 536 tours de hachage, rendant toute attaque par dictionnaire ou table arc-en-ciel inopérante.", "•"),
          makeBullet("Format de stockage : 'sel_base64:hash_base64', permettant une vérification sécurisée lors de la tentative de connexion.", "•"),

          makeH1("Chapitre 3 : Réalisation et Implémentation Logicielle"),
          makeH2("3.1 Backend Spring Boot 3"),
          makeP("Le backend est structuré selon les meilleures pratiques du développement Java d'entreprise :"),
          makeBullet("Couche Repository : Interfaces étendant JpaRepository<T, ID>, bénéficiant de requêtes dérivées et de méthodes optimisées.", "•"),
          makeBullet("Couche Service : Services transactionnels (@Service) encapsulant toutes les vérifications de cohérence métier avant persistance.", "•"),
          makeBullet("Gestionnaire Global d'Exceptions : Un composant @ControllerAdvice (GlobalExceptionHandler) intercepte les IllegalArgumentException et retourne un message d'erreur clair avec le code HTTP 400 Bad Request.", "•"),
          makeBullet("Initialisation Automatique : Le composant DataInitializer alimente automatiquement la base de données au démarrage avec des comptes réalistes du domaine sénégalais de l'UGB (@ugb.edu.sn).", "•"),

          makeH2("3.2 Frontend Angular Standalone"),
          makeP("L'interface utilisateur a été développée en adoptant les dernières normes Angular :"),
          makeBullet("Composants Standalone : Suppression des anciens NgModules au profit de composants autonomes hautement modulaires et légers.", "•"),
          makeBullet("Sidebar Dynamique et Contextuelle : Le composant de navigation latérale inspecte en temps réel le profil de l'utilisateur connecté via AuthService pour afficher uniquement les liens autorisés, et intègre un bouton de déconnexion direct.", "•"),
          makeBullet("Header Universitaire : Affiche le nom de l'utilisateur connecté, son badge de rôle et un raccourci de session.", "•"),
          makeBullet("Formulaires Réactifs : Les formulaires d'inscription, de proposition de sujet et de candidature intègrent des validateurs stricts.", "•"),

          makeH1("Chapitre 4 : Preuves Visuelles des Travaux Réalisés"),
          makeP("Conformément aux directives d'évaluation privilégiant le fonctionnement de bout en bout et les preuves visuelles, ce chapitre présente les captures d'écran commentées des interfaces opérationnelles développées."),

          makeH2("4.1 Espace Étudiant"),
          makeP("L'espace étudiant offre une expérience fluide permettant d'explorer les offres académiques, de postuler et de suivre ses affectations."),
          makeImageParagraph(safeReadImage('media_1792353107634.jpg'), 520, 400),
          makeCaption("4.1", "Tableau de bord de l'étudiant connecté avec indicateurs de synthèse et flux des dernières offres"),
          makeP("Le tableau de bord étudiant affiche en temps réel : le nombre de sujets disponibles (24), le nombre de candidatures déposées (3) et les candidatures acceptées (1), ainsi que les dernières parutions de sujets."),

          makeImageParagraph(safeReadImage('media_1792350928189.png'), 520, 360),
          makeCaption("4.2", "Catalogue dynamique des sujets de projets tutorés avec recherche temps réel et badges de disponibilité"),
          makeP("Le catalogue présente les fiches de sujets proposées par les enseignants, la date limite de soumission des vœux, les quotas restants et un accès direct au détail pour postuler."),

          makeImageParagraph(safeReadImage('media_1792352647521.jpg'), 520, 330),
          makeCaption("4.3", "Interface de consultation et de suivi des candidatures étudiantes"),
          makeP("Cette vue permet à l'étudiant de suivre l'état de chacun de ses vœux : EN_ATTENTE (jaune), ACCEPTEE (vert) ou REJETEE (rouge), garantissant une totale transparence."),

          makeH2("4.2 Espace Enseignant / Encadrant"),
          makeP("L'enseignant dispose d'outils complets pour déposer ses propositions de projets, définir les capacités d'accueil et examiner les dossiers des étudiants intéressés."),
          makeImageParagraph(safeReadImage('media_1792364582043.jpg'), 520, 520),
          makeCaption("4.4", "Tableau de bord Enseignant : indicateurs de charge pédagogique, places ouvertes et candidatures reçues"),
          makeP("Le tableau de bord permet à l'enseignant de visualiser la saturation de ses sujets (ex: 8 places au total, 6 dossiers reçus) et d'accéder rapidement au traitement des candidats."),

          makeImageParagraph(safeReadImage('media_1792364581825.jpg'), 520, 550),
          makeCaption("4.5", "Gestion des sujets proposés et formulaire d'édition / création de sujet de projet tutoré"),
          makeP("L'enseignant peut formuler un titre, une description détaillée, spécifier la capacité maximale en nombre d'étudiants (ex: 2 ou 3) et basculer l'état entre 'Disponible' et 'Complet'."),

          makeImageParagraph(safeReadImage('media_1792364581760.jpg'), 520, 340),
          makeCaption("4.6", "Consultation des candidatures reçues et émission de l'avis pédagogique par l'enseignant"),
          makeP("L'enseignant analyse chaque candidature déposée sur ses sujets et transmet son avis motivé à la Commission Pédagogique."),

          makeH2("4.3 Espace Responsable Pédagogique & Commission d'Arbitrage"),
          makeP("Le responsable pédagogique détient le rôle clé de régulation pour affecter équitablement les étudiants sans saturer les capacités d'encadrement."),
          makeImageParagraph(safeReadImage('media_1792364582094.jpg'), 520, 430),
          makeCaption("4.7", "Tableau de bord de la Commission Pédagogique d'arbitrage"),
          makeP("Synthèse des dossiers déposés (42), dossiers en attente d'arbitrage (5), affectations déjà validées (28) et candidatures réorientées (9)."),

          makeImageParagraph(safeReadImage('media_1792364569509.jpg'), 520, 420),
          makeCaption("4.8", "Module interactif de traitement des vœux et d'arbitrage des affectations"),
          makeP("L'interface d'arbitrage permet à la commission d'examiner le dossier du candidat avec l'avis de l'encadrant, puis de cliquer sur 'Accepter' ou 'Rejeter'. L'acceptation contrôle immédiatement la capacité maximale du sujet."),

          makeImageParagraph(safeReadImage('media_1792354447682.jpg'), 520, 560),
          makeCaption("4.9", "Registre synthétique des affectations et suivi des capacités d'accueil par laboratoire"),
          makeP("Vue consolidée récapitulant les binômes constitués, le taux de remplissage des capacités par laboratoire (LIRIS, CRAN, etc.) et permettant l'exportation des listes officielles."),

          makeH2("4.4 Espace Administration Système"),
          makeP("L'administrateur assure le pilotage transverse de la plateforme et la gestion des comptes académiques."),
          makeImageParagraph(safeReadImage('media_1792354269240.jpg'), 520, 430),
          makeCaption("4.10", "Tableau de bord Administrateur : supervision générale de la promotion"),
          makeP("Surveillance du nombre total d'étudiants inscrits (142), d'encadrants mobilisés (24) et du volume global de vœux enregistrés."),

          makeImageParagraph(safeReadImage('media_1792353960707.jpg'), 520, 500),
          makeCaption("4.11", "Annuaire de gestion des étudiants, inscription et suivi des comptes ENT"),
          makeP("Gestion des profils étudiants, vérification de l'état des comptes ENT et importation éventuelle de listes CSV."),

          makeImageParagraph(safeReadImage('media_1792353474052.jpg'), 520, 490),
          makeCaption("4.12", "Annuaire et gestion des enseignants-chercheurs et répartition des quotas d'encadrement"),
          makeP("Suivi des capacités d'encadrement mobilisées par département et laboratoire, facilitant l'équilibrage de la charge d'enseignement."),

          makeH1("Chapitre 5 : Validation, Tests et Déploiement"),
          makeH2("5.1 Scénarios de Test de Bout en Bout"),
          makeP("Pour valider la robustesse de l'application, une campagne de tests fonctionnels et d'intégration a été conduite de bout en bout :"),
          makeStyledTable(
            ["N° Test", "Scénario de Test", "Comportement Attendu", "Résultat Observé"],
            [
              ["T-01", "Connexion avec identifiants UGB valides", "Génération de la session, redirection vers le tableau de bord approprié avec sidebar adaptée.", "SUCCÈS (200 OK)"],
              ["T-02", "Tentative de connexion avec mot de passe erroné", "Refus immédiat avec code HTTP 401 Unauthorized et message explicite.", "SUCCÈS (401)"],
              ["T-03", "Création de compte étudiant via /inscription", "Création dans la table utilisateur et etudiant, hachage PBKDF2 du mot de passe.", "SUCCÈS (201 Created)"],
              ["T-04", "Proposition d'un sujet par un enseignant", "Persistance en base MySQL avec statut DISPONIBLE et capacité configurée.", "SUCCÈS (200 OK)"],
              ["T-05", "Dépôt d'une première candidature par un étudiant", "Création de la candidature au statut EN_ATTENTE.", "SUCCÈS (200 OK)"],
              ["T-06", "Tentative de seconde candidature sur le même sujet", "Détection de doublon, rejet strict avec HTTP 400 Bad Request (Règle RM-01).", "SUCCÈS (400 Conforme)"],
              ["T-07", "Arbitrage positif par le Responsable Pédagogique", "Passage du statut à ACCEPTEE, création de l'Affectation, décrément de la capacité restante.", "SUCCÈS (200 OK)"],
              ["T-08", "Saturation de la capacité maximale d'un sujet", "Le sujet bascule automatiquement au statut COMPLET et n'accepte plus de nouveaux vœux.", "SUCCÈS (Règle validée)"],
              ["T-09", "Déconnexion sécurisée via le bouton de la sidebar", "Suppression du token de session dans le localStorage et redirection vers la page d'accueil.", "SUCCÈS (Interface nettoyée)"]
            ]
          ),

          makeH2("5.2 Comptes de Démonstration Pré-configurés (UGB)"),
          makeP("Afin de permettre une évaluation immédiate par les membres du jury, le système est pré-chargé avec les comptes de test suivants (mot de passe universel : Passer123!) :"),
          makeStyledTable(
            ["Rôle", "Nom et Prénom", "Adresse Email Académique UGB", "Matricule / Profil"],
            [
              ["ADMIN", "Ndiaye Cheikh Tidiane", "cheikh-tidiane.ndiaye@ugb.edu.sn", "Direction Informatique / ENT"],
              ["RESPONSABLE", "Dr. Sow Aminata", "aminata.sow@ugb.edu.sn", "Responsable Pédagogique M2 GDIL"],
              ["ENSEIGNANT", "Pr. Diop Moussa", "moussa.diop@ugb.edu.sn", "ENS-UGB-042 - Informatique UFR SAT"],
              ["ETUDIANT", "Touré Mamadou Alpha", "toure.mamadou-alpha@ugb.edu.sn", "P300001 - M2 Génie Informatique"],
              ["ETUDIANT", "Ndiaye Fatou Marie", "ndiaye.fatou-marie@ugb.edu.sn", "P310045 - M2 Génie Informatique"]
            ]
          ),

          makeH1("Conclusion Générale et Perspectives"),
          makeP("Le projet pratique de développement d'applications multi-tiers a permis de concevoir et d'implémenter intégralement la solution UniProjet. Toutes les exigences fonctionnelles et architecturales formulées dans le cadre du Master 2 GDIL ont été menées à bien :"),
          makeBullet("Séparation rigoureuse et démontrée entre la couche présentation (Angular), la logique métier (Spring Boot Services) et la persistance des données (Spring Data JPA / MySQL).", "•"),
          makeBullet("Respect strict des règles métier académiques (unicité des candidatures, gestion automatisée des capacités et quotas d'accueil).", "•"),
          makeBullet("Sécurisation robuste des authentifications par sel cryptographique et hachage PBKDF2.", "•"),
          makeBullet("Expérience utilisateur intuitive avec navigation dynamique selon le profil connecté et déconnexion sécurisée.", "•"),
          makeP("En perspective, ce projet pourrait évoluer vers :"),
          makeBullet("La génération automatisée et la signature électronique des Procès-Verbaux officiels d'affectation au format PDF.", "1."),
          makeBullet("L'intégration d'un système de notifications instantanées par WebSockets ou push e-mail lors des décisions d'arbitrage.", "2."),
          makeBullet("La conteneurisation intégrale sous Docker et le déploiement orchestré via Kubernetes sur un cluster universitaire.", "3.")
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUTPUT_FILE, buffer);
  console.log('Report generated successfully at:', OUTPUT_FILE);
}

buildDoc().catch(err => {
  console.error('Error generating document:', err);
  process.exit(1);
});
