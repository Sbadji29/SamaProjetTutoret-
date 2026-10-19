
package com.m2GDIL.backend_uniprojet.candidature;

import com.m2GDIL.backend_uniprojet.etudiant.Etudiant;
import com.m2GDIL.backend_uniprojet.etudiant.EtudiantRepository;
import com.m2GDIL.backend_uniprojet.sujet.Sujet;
import com.m2GDIL.backend_uniprojet.sujet.SujetRepository;
import com.m2GDIL.backend_uniprojet.sessionuniversitaire.SessionUniversitaire;
import com.m2GDIL.backend_uniprojet.sessionuniversitaire.SessionUniversitaireRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CandidatureService {

    private final CandidatureRepository candidatureRepository;
    private final EtudiantRepository etudiantRepository;
    private final SujetRepository sujetRepository;
    private final SessionUniversitaireRepository sessionRepository;

    public CandidatureService(
            CandidatureRepository candidatureRepository,
            EtudiantRepository etudiantRepository,
            SujetRepository sujetRepository,
            SessionUniversitaireRepository sessionRepository) {

        this.candidatureRepository = candidatureRepository;
        this.etudiantRepository = etudiantRepository;
        this.sujetRepository = sujetRepository;
        this.sessionRepository = sessionRepository;
    }

    @Transactional
    public Candidature creer(
            Candidature donnees,
            Long etudiantId,
            Long sujetId,
            Long sessionId) {

        if (donnees.getPriorite() == null
                || donnees.getPriorite() < 1) {
            throw new IllegalArgumentException(
                "La priorite doit etre superieure ou egale a 1.");
        }

        Etudiant etudiant = etudiantRepository.findById(etudiantId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Etudiant introuvable : " + etudiantId));

        Sujet sujet = sujetRepository.findById(sujetId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Sujet introuvable : " + sujetId));

        SessionUniversitaire session =
            sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException(
                    "Session universitaire introuvable : " + sessionId));

        if (!sujet.getSessionUniversitaire().getId().equals(sessionId)) {
            throw new IllegalArgumentException(
                "Le sujet n'appartient pas a cette session.");
        }

        if (!Boolean.TRUE.equals(session.getActive())) {
            throw new IllegalArgumentException(
                "La session universitaire n'est pas active.");
        }

        if (!Boolean.TRUE.equals(sujet.getDisponible())) {
            throw new IllegalArgumentException(
                "Ce sujet n'est pas disponible.");
        }

        if (session.getDateClotureVoeux() != null
                && LocalDateTime.now().isAfter(
                    session.getDateClotureVoeux())) {
            throw new IllegalArgumentException(
                "La periode de depot des voeux est terminee.");
        }

        boolean existe =
            candidatureRepository
                .existsByEtudiantIdAndSujetIdAndSessionUniversitaireId(
                    etudiantId, sujetId, sessionId);

        if (existe) {
            throw new IllegalArgumentException(
                "Cet etudiant a deja candidate a ce sujet pour cette session.");
        }

        donnees.setEtudiant(etudiant);
        donnees.setSujet(sujet);
        donnees.setSessionUniversitaire(session);
        donnees.setDateCandidature(LocalDateTime.now());
        donnees.setStatut(StatutCandidature.EN_ATTENTE);

        return candidatureRepository.save(donnees);
    }

    public List<Candidature> obtenirToutes() {
        return candidatureRepository.findAll();
    }

    public Candidature obtenirParId(Long id) {
        return candidatureRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException(
                "Candidature introuvable : " + id));
    }

    public List<Candidature> obtenirParEtudiant(Long etudiantId) {
        return candidatureRepository.findByEtudiantId(etudiantId);
    }

    public List<Candidature> obtenirParSujet(Long sujetId) {
        return candidatureRepository.findBySujetId(sujetId);
    }

    public List<Candidature> obtenirParSession(Long sessionId) {
        return candidatureRepository.findBySessionUniversitaireId(sessionId);
    }

    public List<Candidature> obtenirParStatut(
            StatutCandidature statut) {
        return candidatureRepository.findByStatut(statut);
    }

    public List<Candidature> obtenirVoeuxEtudiant(
            Long etudiantId, Long sessionId) {
        return candidatureRepository
            .findByEtudiantIdAndSessionUniversitaireIdOrderByPrioriteAsc(
                etudiantId, sessionId);
    }

    @Transactional
    public Candidature modifier(
            Long id, Candidature donnees) {

        Candidature candidature = obtenirParId(id);

        if (candidature.getStatut() != StatutCandidature.EN_ATTENTE) {
            throw new IllegalArgumentException(
                "Seule une candidature en attente peut etre modifiee.");
        }

        if (donnees.getPriorite() != null) {
            if (donnees.getPriorite() < 1) {
                throw new IllegalArgumentException(
                    "La priorite doit etre superieure ou egale a 1.");
            }
            candidature.setPriorite(donnees.getPriorite());
        }

        if (donnees.getMotivation() != null) {
            candidature.setMotivation(donnees.getMotivation());
        }

        return candidatureRepository.save(candidature);
    }

    @Transactional
    public Candidature changerStatut(
            Long id, StatutCandidature statut) {

        Candidature candidature = obtenirParId(id);

        if (statut == null) {
            throw new IllegalArgumentException(
                "Le statut est obligatoire.");
        }

        candidature.setStatut(statut);

        return candidatureRepository.save(candidature);
    }

    @Transactional
    public void supprimer(Long id) {
        Candidature candidature = obtenirParId(id);
        candidatureRepository.delete(candidature);
    }

    public long compter() {
        return candidatureRepository.count();
    }
}
