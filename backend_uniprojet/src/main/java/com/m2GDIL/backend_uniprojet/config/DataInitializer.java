package com.m2GDIL.backend_uniprojet.config;

import com.m2GDIL.backend_uniprojet.administrateur.Administrateur;
import com.m2GDIL.backend_uniprojet.administrateur.AdministrateurRepository;
import com.m2GDIL.backend_uniprojet.affectation.Affectation;
import com.m2GDIL.backend_uniprojet.affectation.AffectationRepository;
import com.m2GDIL.backend_uniprojet.affectation.StatutAffectation;
import com.m2GDIL.backend_uniprojet.candidature.Candidature;
import com.m2GDIL.backend_uniprojet.candidature.CandidatureRepository;
import com.m2GDIL.backend_uniprojet.candidature.StatutCandidature;
import com.m2GDIL.backend_uniprojet.enseignant.Enseignant;
import com.m2GDIL.backend_uniprojet.enseignant.EnseignantRepository;
import com.m2GDIL.backend_uniprojet.etudiant.Etudiant;
import com.m2GDIL.backend_uniprojet.etudiant.EtudiantRepository;
import com.m2GDIL.backend_uniprojet.responsablepedagogique.ResponsablePedagogique;
import com.m2GDIL.backend_uniprojet.responsablepedagogique.ResponsablePedagogiqueRepository;
import com.m2GDIL.backend_uniprojet.sessionuniversitaire.SessionUniversitaire;
import com.m2GDIL.backend_uniprojet.sessionuniversitaire.SessionUniversitaireRepository;
import com.m2GDIL.backend_uniprojet.sujet.Sujet;
import com.m2GDIL.backend_uniprojet.sujet.SujetRepository;
import com.m2GDIL.backend_uniprojet.utilisateur.Utilisateur;
import com.m2GDIL.backend_uniprojet.utilisateur.UtilisateurRepository;
import com.m2GDIL.backend_uniprojet.utilisateur.UtilisateurService;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SessionUniversitaireRepository sessionRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final UtilisateurService utilisateurService;
    private final AdministrateurRepository adminRepository;
    private final ResponsablePedagogiqueRepository responsableRepository;
    private final EnseignantRepository enseignantRepository;
    private final EtudiantRepository etudiantRepository;
    private final SujetRepository sujetRepository;
    private final CandidatureRepository candidatureRepository;
    private final AffectationRepository affectationRepository;

    public DataInitializer(
            SessionUniversitaireRepository sessionRepository,
            UtilisateurRepository utilisateurRepository,
            UtilisateurService utilisateurService,
            AdministrateurRepository adminRepository,
            ResponsablePedagogiqueRepository responsableRepository,
            EnseignantRepository enseignantRepository,
            EtudiantRepository etudiantRepository,
            SujetRepository sujetRepository,
            CandidatureRepository candidatureRepository,
            AffectationRepository affectationRepository) {

        this.sessionRepository = sessionRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.utilisateurService = utilisateurService;
        this.adminRepository = adminRepository;
        this.responsableRepository = responsableRepository;
        this.enseignantRepository = enseignantRepository;
        this.etudiantRepository = etudiantRepository;
        this.sujetRepository = sujetRepository;
        this.candidatureRepository = candidatureRepository;
        this.affectationRepository = affectationRepository;
    }

    @Override
    public void run(String... args) {

        SessionUniversitaire session;

        var sessionExistante = sessionRepository
                .findByLibelleIgnoreCase("Session 2026-2027");

        if (sessionExistante.isPresent()) {
            session = sessionExistante.get();
        } else {
            SessionUniversitaire nouvelleSession = new SessionUniversitaire();
            nouvelleSession.setLibelle("Session 2026-2027");
            nouvelleSession.setDateDebut(LocalDate.of(2026, 9, 1));
            nouvelleSession.setDateFin(LocalDate.of(2027, 6, 30));
            nouvelleSession.setActive(true);
            nouvelleSession.setDateClotureVoeux(LocalDateTime.now().plusMonths(2));
            nouvelleSession.setDateLimiteEvaluation(LocalDateTime.now().plusMonths(3));
            session = sessionRepository.save(nouvelleSession);
        }

        String adminEmail = "cheikh-tidiane.ndiaye@ugb.edu.sn";
        if (!utilisateurRepository.existsByEmailIgnoreCase(adminEmail)) {
            Utilisateur uAdmin = new Utilisateur("Ndiaye", "Cheikh Tidiane", adminEmail, "Passer123!");
            uAdmin = utilisateurService.creer(uAdmin);
            Administrateur admin = new Administrateur();
            admin.setUtilisateur(uAdmin);
            adminRepository.save(admin);
        }

        String respEmail = "aminata.sow@ugb.edu.sn";
        ResponsablePedagogique resp;
        if (!utilisateurRepository.existsByEmailIgnoreCase(respEmail)) {
            Utilisateur uResp = new Utilisateur("Sow", "Aminata", respEmail, "Passer123!");
            uResp = utilisateurService.creer(uResp);
            resp = new ResponsablePedagogique();
            resp.setUtilisateur(uResp);
            resp = responsableRepository.save(resp);
        } else {
            Utilisateur u = utilisateurRepository.findByEmailIgnoreCase(respEmail).orElseThrow();
            resp = responsableRepository.findByUtilisateurId(u.getId()).orElse(null);
        }

        Enseignant ens1 = creerEnseignantSiAbsent(
                "Diop", "Moussa", "moussa.diop@ugb.edu.sn",
                "ENS-UGB-042", "Informatique - UFR SAT",
                "Systèmes distribués et Cloud", "Laboratoire d'informatique", 6
        );

        Enseignant ens2 = creerEnseignantSiAbsent(
                "Sall", "Ousmane", "ousmane.sall@ugb.edu.sn",
                "ENS-UGB-018", "Informatique - UFR SAT",
                "Réseaux et Sécurité", "Laboratoire LANI", 6
        );

        Enseignant ens3 = creerEnseignantSiAbsent(
                "Fall", "Khady", "khady.fall@ugb.edu.sn",
                "ENS-UGB-029", "Informatique - UFR SAT",
                "Intelligence Artificielle", "Laboratoire LANI", 4
        );

        Etudiant etu1 = creerEtudiantSiAbsent(
                "Touré", "Mamadou Alpha", "toure.mamadou-alpha@ugb.edu.sn",
                "P300001", "Master Génie Informatique (M2 GDIL)", "M2"
        );

        Etudiant etu2 = creerEtudiantSiAbsent(
                "Ndiaye", "Fatou Marie", "ndiaye.fatou-marie@ugb.edu.sn",
                "P310045", "Master Génie Informatique (M2 GDIL)", "M2"
        );

        Etudiant etu3 = creerEtudiantSiAbsent(
                "Badji", "Alioune Badara", "badji.alioune-badara@ugb.edu.sn",
                "P300012", "Master Génie Informatique (M2 GDIL)", "M2"
        );

        Etudiant etu4 = creerEtudiantSiAbsent(
                "Diallo", "Aminata", "diallo.aminata@ugb.edu.sn",
                "P310088", "Master Génie Informatique (M2 GDIL)", "M2"
        );

        Etudiant etu5 = creerEtudiantSiAbsent(
                "Sarr", "Ibrahima", "sarr.ibrahima@ugb.edu.sn",
                "P300099", "Master Génie Informatique (M2 GDIL)", "M2"
        );

        Sujet s1 = creerSujetSiAbsent(
                "SUJ-UGB-01",
                "Conception d'une plateforme numérique de suivi des activités agricoles au Sénégal",
                "Développement d'une solution informatique permettant de collecter, centraliser et analyser les données agricoles pour faciliter le suivi des exploitations et la prise de décision.",
                3, ens1, session
        );

        Sujet s2 = creerSujetSiAbsent(
                "SUJ-UGB-02",
                "Détection d'anomalies réseau et sécurisation des infrastructures informatiques universitaires",
                "Étude et mise en œuvre d'une solution de surveillance du trafic réseau visant à détecter les comportements anormaux et à renforcer la sécurité des infrastructures informatiques de l'UGB.",
                2, ens1, session
        );

        Sujet s3 = creerSujetSiAbsent(
                "SUJ-UGB-03",
                "Architecture Microservices et Orchestration Kubernetes pour le Cloud UGB",
                "Conception d'une infrastructure cloud native hautement disponible basée sur Kubernetes pour les services numériques du campus de Sanar.",
                2, ens2, session
        );

        Sujet s4 = creerSujetSiAbsent(
                "SUJ-UGB-04",
                "Système intelligent de prédiction des rendements agricoles par Vision et IA",
                "Modélisation d'un pipeline d'apprentissage profond pour l'analyse d'imagerie multispectrale dans la vallée du fleuve Sénégal.",
                3, ens3, session
        );

        Candidature c1 = creerCandidatureSiAbsente(
                etu1, s1, session, ens1, resp, 1,
                StatutCandidature.EN_ATTENTE,
                "Passionné par l'agritech et le génie logiciel appliqué aux problématiques locales sénégalaises.",
                "Profil académique solide, dossier très favorable pour ce projet."
        );

        Candidature c2 = creerCandidatureSiAbsente(
                etu2, s2, session, ens1, resp, 1,
                StatutCandidature.ACCEPTEE,
                "Forte motivation pour l'administration système et la cybersécurité des réseaux universitaires.",
                "Excellentes compétences en sécurité réseau démontrées lors des TP."
        );

        Candidature c3 = creerCandidatureSiAbsente(
                etu3, s1, session, ens1, resp, 1,
                StatutCandidature.EN_ATTENTE,
                "Intérêt marqué pour l'ingénierie logicielle et le développement de plateformes web réactives.",
                "Avis favorable de l'encadrant, en attente de l'arbitrage final du jury."
        );

        Candidature c4 = creerCandidatureSiAbsente(
                etu4, s3, session, ens2, resp, 1,
                StatutCandidature.ACCEPTEE,
                "Volonté d'approfondir l'orchestration de conteneurs et les architectures cloud modernes.",
                "Très bon niveau en virtualisation et systèmes distribués."
        );

        Candidature c5 = creerCandidatureSiAbsente(
                etu5, s2, session, ens1, resp, 2,
                StatutCandidature.REJETEE,
                "Deuxième vœu d'orientation en réseaux et télécommunications.",
                "Capacité maximale du sujet atteinte pour cette session."
        );

        if (c2 != null) {
            creerAffectationSiAbsente(c2, etu2, s2);
        }
        if (c4 != null) {
            creerAffectationSiAbsente(c4, etu4, s3);
        }
    }

    private Enseignant creerEnseignantSiAbsent(
            String nom, String prenom, String email,
            String matricule, String departement,
            String specialite, String laboratoire, int quota) {

        if (!utilisateurRepository.existsByEmailIgnoreCase(email)) {
            Utilisateur u = new Utilisateur(nom, prenom, email, "Passer123!");
            u = utilisateurService.creer(u);
            Enseignant ens = new Enseignant();
            ens.setMatricule(matricule);
            ens.setDepartement(departement);
            ens.setSpecialite(specialite);
            ens.setLaboratoire(laboratoire);
            ens.setQuotaEncadrement(quota);
            ens.setUtilisateur(u);
            return enseignantRepository.save(ens);
        } else {
            Utilisateur u = utilisateurRepository.findByEmailIgnoreCase(email).orElseThrow();
            return enseignantRepository.findByUtilisateurId(u.getId()).orElse(null);
        }
    }

    private Etudiant creerEtudiantSiAbsent(
            String nom, String prenom, String email,
            String numEtu, String filiere, String niveau) {

        if (!utilisateurRepository.existsByEmailIgnoreCase(email)) {
            Utilisateur u = new Utilisateur(nom, prenom, email, "Passer123!");
            u = utilisateurService.creer(u);
            Etudiant etu = new Etudiant();
            etu.setNumeroEtudiant(numEtu);
            etu.setFiliere(filiere);
            etu.setNiveau(niveau);
            etu.setUtilisateur(u);
            return etudiantRepository.save(etu);
        } else {
            Utilisateur u = utilisateurRepository.findByEmailIgnoreCase(email).orElseThrow();
            return etudiantRepository.findByUtilisateurId(u.getId()).orElse(null);
        }
    }

    private Sujet creerSujetSiAbsent(
            String reference, String titre, String description,
            int capacite, Enseignant ens, SessionUniversitaire session) {

        if (ens == null) {
            return null;
        }

        var opt = sujetRepository.findByReferenceAndSessionUniversitaireId(reference, session.getId());
        if (opt.isPresent()) {
            return opt.get();
        }

        Sujet s = new Sujet();
        s.setReference(reference);
        s.setTitre(titre);
        s.setDescription(description);
        s.setCapaciteMax(capacite);
        s.setDisponible(true);
        s.setEnseignant(ens);
        s.setSessionUniversitaire(session);
        return sujetRepository.save(s);
    }

    private Candidature creerCandidatureSiAbsente(
            Etudiant etu, Sujet sujet, SessionUniversitaire session,
            Enseignant ens, ResponsablePedagogique resp, int priorite,
            StatutCandidature statut, String motivation, String avisEncadrant) {

        if (etu == null || sujet == null) {
            return null;
        }

        if (candidatureRepository.existsByEtudiantIdAndSujetIdAndSessionUniversitaireId(
                etu.getId(), sujet.getId(), session.getId())) {
            var cands = candidatureRepository.findByEtudiantId(etu.getId());
            return cands.stream()
                    .filter(c -> c.getSujet().getId().equals(sujet.getId()))
                    .findFirst()
                    .orElse(null);
        }

        Candidature c = new Candidature();
        c.setEtudiant(etu);
        c.setSujet(sujet);
        c.setSessionUniversitaire(session);
        c.setEnseignant(ens);
        c.setResponsablePedagogique(resp);
        c.setPriorite(priorite);
        c.setStatut(statut);
        c.setDateCandidature(LocalDateTime.now().minusDays(3));
        c.setMotivation(motivation);
        c.setAvisEncadrant(avisEncadrant);
        return candidatureRepository.save(c);
    }

    private void creerAffectationSiAbsente(Candidature c, Etudiant etu, Sujet sujet) {
        if (c == null || etu == null || sujet == null) {
            return;
        }
        if (!affectationRepository.existsByCandidatureId(c.getId())) {
            Affectation aff = new Affectation();
            aff.setCandidature(c);
            aff.setEtudiant(etu);
            aff.setSujet(sujet);
            aff.setDateAffectation(LocalDateTime.now().minusDays(1));
            aff.setStatut(StatutAffectation.ACTIVE);
            affectationRepository.save(aff);
        }
    }
}
