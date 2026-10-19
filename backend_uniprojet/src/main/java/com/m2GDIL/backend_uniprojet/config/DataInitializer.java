package com.m2GDIL.backend_uniprojet.config;

import com.m2GDIL.backend_uniprojet.administrateur.Administrateur;
import com.m2GDIL.backend_uniprojet.administrateur.AdministrateurRepository;
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

    public DataInitializer(
            SessionUniversitaireRepository sessionRepository,
            UtilisateurRepository utilisateurRepository,
            UtilisateurService utilisateurService,
            AdministrateurRepository adminRepository,
            ResponsablePedagogiqueRepository responsableRepository,
            EnseignantRepository enseignantRepository,
            EtudiantRepository etudiantRepository,
            SujetRepository sujetRepository) {

        this.sessionRepository = sessionRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.utilisateurService = utilisateurService;
        this.adminRepository = adminRepository;
        this.responsableRepository = responsableRepository;
        this.enseignantRepository = enseignantRepository;
        this.etudiantRepository = etudiantRepository;
        this.sujetRepository = sujetRepository;
    }

    @Override
    public void run(String... args) {

        SessionUniversitaire session;

        var sessionsActives = sessionRepository.findByActive(true);

        if (!sessionsActives.isEmpty()) {
            session = sessionsActives.get(0);

        } else if (sessionRepository.count() > 0) {
            session = sessionRepository.findAll().get(0);

        } else {
            SessionUniversitaire nouvelleSession = new SessionUniversitaire();

            nouvelleSession.setLibelle("Session 2026-2027");
            nouvelleSession.setDateDebut(LocalDate.of(2026, 9, 1));
            nouvelleSession.setDateFin(LocalDate.of(2027, 6, 30));
            nouvelleSession.setActive(true);
            nouvelleSession.setDateClotureVoeux(
                    LocalDateTime.now().plusMonths(2));
            nouvelleSession.setDateLimiteEvaluation(
                    LocalDateTime.now().plusMonths(3));

            session = sessionRepository.save(nouvelleSession);
        }

        String adminEmail = "cheikh-tidiane.ndiaye@ugb.edu.sn";

        if (!utilisateurRepository.existsByEmailIgnoreCase(adminEmail)) {

            Utilisateur uAdmin = new Utilisateur(
                    "Ndiaye",
                    "Cheikh Tidiane",
                    adminEmail,
                    "Passer123!"
            );

            uAdmin = utilisateurService.creer(uAdmin);

            Administrateur admin = new Administrateur();
            admin.setUtilisateur(uAdmin);

            adminRepository.save(admin);
        }

        String respEmail = "aminata.sow@ugb.edu.sn";

        if (!utilisateurRepository.existsByEmailIgnoreCase(respEmail)) {

            Utilisateur uResp = new Utilisateur(
                    "Sow",
                    "Aminata",
                    respEmail,
                    "Passer123!"
            );

            uResp = utilisateurService.creer(uResp);

            ResponsablePedagogique resp = new ResponsablePedagogique();
            resp.setUtilisateur(uResp);

            responsableRepository.save(resp);
        }

        String ensEmail = "moussa.diop@ugb.edu.sn";

        Enseignant ens;

        if (!utilisateurRepository.existsByEmailIgnoreCase(ensEmail)) {

            Utilisateur uEns = new Utilisateur(
                    "Diop",
                    "Moussa",
                    ensEmail,
                    "Passer123!"
            );

            uEns = utilisateurService.creer(uEns);

            ens = new Enseignant();

            ens.setMatricule("ENS-UGB-042");
            ens.setDepartement("Informatique - UFR SAT");
            ens.setSpecialite("Systèmes distribués et Cloud");
            ens.setLaboratoire("Laboratoire d'informatique");
            ens.setQuotaEncadrement(6);
            ens.setUtilisateur(uEns);

            ens = enseignantRepository.save(ens);

        } else {

            Utilisateur u = utilisateurRepository
                    .findByEmailIgnoreCase(ensEmail)
                    .orElseThrow();

            ens = enseignantRepository
                    .findByUtilisateurId(u.getId())
                    .orElse(null);
        }

        String etuEmail = "toure.mamadou-alpha@ugb.edu.sn";

        if (!utilisateurRepository.existsByEmailIgnoreCase(etuEmail)) {

            Utilisateur uEtu = new Utilisateur(
                    "Touré",
                    "Mamadou Alpha",
                    etuEmail,
                    "Passer123!"
            );

            uEtu = utilisateurService.creer(uEtu);

            Etudiant etu = new Etudiant();

            etu.setNumeroEtudiant("P300001");
            etu.setFiliere("Master Génie Informatique (M2 GDIL)");
            etu.setNiveau("M2");
            etu.setUtilisateur(uEtu);

            etudiantRepository.save(etu);
        }

        String etuEmail2 = "ndiaye.fatou-marie@ugb.edu.sn";

        if (!utilisateurRepository.existsByEmailIgnoreCase(etuEmail2)) {

            Utilisateur uEtu2 = new Utilisateur(
                    "Ndiaye",
                    "Fatou Marie",
                    etuEmail2,
                    "Passer123!"
            );

            uEtu2 = utilisateurService.creer(uEtu2);

            Etudiant etu2 = new Etudiant();

            etu2.setNumeroEtudiant("P310045");
            etu2.setFiliere("Master Génie Informatique (M2 GDIL)");
            etu2.setNiveau("M2");
            etu2.setUtilisateur(uEtu2);

            etudiantRepository.save(etu2);
        }

        if (ens != null) {
            if (!sujetRepository.existsByReferenceAndSessionUniversitaireId("SUJ-UGB-01", session.getId())) {
                Sujet s1 = new Sujet();
                s1.setReference("SUJ-UGB-01");
                s1.setTitre(
                        "Conception d'une plateforme numérique de suivi " +
                        "des activités agricoles au Sénégal"
                );
                s1.setDescription(
                        "Développement d'une solution informatique permettant " +
                        "de collecter, centraliser et analyser les données " +
                        "agricoles pour faciliter le suivi des exploitations " +
                        "et la prise de décision."
                );
                s1.setCapaciteMax(3);
                s1.setDisponible(true);
                s1.setEnseignant(ens);
                s1.setSessionUniversitaire(session);

                sujetRepository.save(s1);
            }

            if (!sujetRepository.existsByReferenceAndSessionUniversitaireId("SUJ-UGB-02", session.getId())) {
                Sujet s2 = new Sujet();
                s2.setReference("SUJ-UGB-02");
                s2.setTitre(
                        "Détection d'anomalies réseau et sécurisation " +
                        "des infrastructures informatiques universitaires"
                );
                s2.setDescription(
                        "Étude et mise en œuvre d'une solution de surveillance " +
                        "du trafic réseau visant à détecter les comportements " +
                        "anormaux et à renforcer la sécurité des infrastructures " +
                        "informatiques de l'UGB."
                );
                s2.setCapaciteMax(2);
                s2.setDisponible(true);
                s2.setEnseignant(ens);
                s2.setSessionUniversitaire(session);

                sujetRepository.save(s2);
            }
        }
    }
}
