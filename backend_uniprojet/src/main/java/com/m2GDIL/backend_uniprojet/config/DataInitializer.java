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
import com.m2GDIL.backend_uniprojet.utilisateur.UtilisateurService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SessionUniversitaireRepository sessionRepository;
    private final UtilisateurService utilisateurService;
    private final AdministrateurRepository adminRepository;
    private final ResponsablePedagogiqueRepository responsableRepository;
    private final EnseignantRepository enseignantRepository;
    private final EtudiantRepository etudiantRepository;
    private final SujetRepository sujetRepository;

    public DataInitializer(
            SessionUniversitaireRepository sessionRepository,
            UtilisateurService utilisateurService,
            AdministrateurRepository adminRepository,
            ResponsablePedagogiqueRepository responsableRepository,
            EnseignantRepository enseignantRepository,
            EtudiantRepository etudiantRepository,
            SujetRepository sujetRepository) {
        this.sessionRepository = sessionRepository;
        this.utilisateurService = utilisateurService;
        this.adminRepository = adminRepository;
        this.responsableRepository = responsableRepository;
        this.enseignantRepository = enseignantRepository;
        this.etudiantRepository = etudiantRepository;
        this.sujetRepository = sujetRepository;
    }

    @Override
    public void run(String... args) {
        if (sessionRepository.count() > 0) {
            return;
        }

        SessionUniversitaire session = new SessionUniversitaire();
        session.setLibelle("Session 2024-2025");
        session.setDateDebut(LocalDate.of(2024, 9, 1));
        session.setDateFin(LocalDate.of(2025, 6, 30));
        session.setActive(true);
        session.setDateClotureVoeux(LocalDateTime.now().plusMonths(2));
        session.setDateLimiteEvaluation(LocalDateTime.now().plusMonths(3));
        session = sessionRepository.save(session);

        Utilisateur uAdmin = new Utilisateur("Le Gall", "Marc", "admin@univ.fr", "Password123!");
        uAdmin = utilisateurService.creer(uAdmin);
        Administrateur admin = new Administrateur();
        admin.setUtilisateur(uAdmin);
        adminRepository.save(admin);

        Utilisateur uResp = new Utilisateur("Fontaine", "Alexandre", "responsable@univ.fr", "Password123!");
        uResp = utilisateurService.creer(uResp);
        ResponsablePedagogique resp = new ResponsablePedagogique();
        resp.setUtilisateur(uResp);
        responsableRepository.save(resp);

        Utilisateur uEns = new Utilisateur("Bernard", "Marc", "enseignant@univ.fr", "Password123!");
        uEns = utilisateurService.creer(uEns);
        Enseignant ens = new Enseignant();
        ens.setMatricule("ENS2024001");
        ens.setDepartement("Informatique");
        ens.setSpecialite("Systèmes distribués");
        ens.setLaboratoire("LIRIS");
        ens.setQuotaEncadrement(5);
        ens.setUtilisateur(uEns);
        ens = enseignantRepository.save(ens);

        Utilisateur uEtu = new Utilisateur("Laurent", "Camille", "etudiant@univ.fr", "Password123!");
        uEtu = utilisateurService.creer(uEtu);
        Etudiant etu = new Etudiant();
        etu.setNumeroEtudiant("ETU2024001");
        etu.setFiliere("Master Informatique");
        etu.setNiveau("M2");
        etu.setUtilisateur(uEtu);
        etudiantRepository.save(etu);

        Sujet s1 = new Sujet();
        s1.setReference("SUJ-2024-042");
        s1.setTitre("Plateforme de télé-médecine sécurisée sur Kubernetes");
        s1.setDescription("Conception d'une architecture multi-tenant conforme RGPD/HDS pour flux vidéo et dossier patient sécurisé avec enclave SGX.");
        s1.setCapaciteMax(3);
        s1.setDisponible(true);
        s1.setEnseignant(ens);
        s1.setSessionUniversitaire(session);
        sujetRepository.save(s1);

        Sujet s2 = new Sujet();
        s2.setReference("SUJ-2024-048");
        s2.setTitre("Détection d'anomalies réseau via Transformer & eBPF");
        s2.setDescription("Extraction de métriques réseau en temps réel via des programmes eBPF dans le noyau Linux.");
        s2.setCapaciteMax(2);
        s2.setDisponible(true);
        s2.setEnseignant(ens);
        s2.setSessionUniversitaire(session);
        sujetRepository.save(s2);
    }
}
