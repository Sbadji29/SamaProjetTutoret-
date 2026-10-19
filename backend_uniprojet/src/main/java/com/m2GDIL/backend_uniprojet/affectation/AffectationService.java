
package com.m2GDIL.backend_uniprojet.affectation;

import com.m2GDIL.backend_uniprojet.candidature.Candidature;
import com.m2GDIL.backend_uniprojet.candidature.CandidatureRepository;
import com.m2GDIL.backend_uniprojet.candidature.StatutCandidature;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AffectationService {

    private final AffectationRepository affectationRepository;
    private final CandidatureRepository candidatureRepository;

    public AffectationService(
            AffectationRepository affectationRepository,
            CandidatureRepository candidatureRepository) {
        this.affectationRepository = affectationRepository;
        this.candidatureRepository = candidatureRepository;
    }

    @Transactional
    public Affectation creer(Long candidatureId) {

        Candidature candidature = candidatureRepository
            .findById(candidatureId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Candidature introuvable : " + candidatureId));

        if (candidature.getStatut() != StatutCandidature.ACCEPTEE) {
            throw new IllegalArgumentException(
                "Seule une candidature acceptee peut etre affectee.");
        }

        if (affectationRepository
                .existsByCandidatureId(candidatureId)) {
            throw new IllegalArgumentException(
                "Cette candidature possede deja une affectation.");
        }

        Affectation affectation = new Affectation();

        affectation.setCandidature(candidature);
        affectation.setEtudiant(candidature.getEtudiant());
        affectation.setSujet(candidature.getSujet());
        affectation.setDateAffectation(LocalDateTime.now());
        affectation.setStatut(StatutAffectation.ACTIVE);

        return affectationRepository.save(affectation);
    }

    public List<Affectation> obtenirToutes() {
        return affectationRepository.findAll();
    }

    public Affectation obtenirParId(Long id) {
        return affectationRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException(
                "Affectation introuvable : " + id));
    }

    public Affectation obtenirParCandidature(Long candidatureId) {
        return affectationRepository.findByCandidatureId(candidatureId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Aucune affectation pour cette candidature."));
    }

    public List<Affectation> obtenirParEtudiant(Long etudiantId) {
        return affectationRepository.findByEtudiantId(etudiantId);
    }

    public List<Affectation> obtenirParSujet(Long sujetId) {
        return affectationRepository.findBySujetId(sujetId);
    }

    public List<Affectation> obtenirParStatut(
            StatutAffectation statut) {
        return affectationRepository.findByStatut(statut);
    }

    @Transactional
    public Affectation changerStatut(
            Long id, StatutAffectation nouveauStatut) {

        Affectation affectation = obtenirParId(id);

        if (nouveauStatut == null) {
            throw new IllegalArgumentException(
                "Le statut est obligatoire.");
        }

        affectation.setStatut(nouveauStatut);

        return affectationRepository.save(affectation);
    }

    public long compter() {
        return affectationRepository.count();
    }
}
