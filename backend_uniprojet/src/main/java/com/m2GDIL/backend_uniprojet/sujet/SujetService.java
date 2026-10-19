
package com.m2GDIL.backend_uniprojet.sujet;

import com.m2GDIL.backend_uniprojet.enseignant.Enseignant;
import com.m2GDIL.backend_uniprojet.enseignant.EnseignantRepository;
import com.m2GDIL.backend_uniprojet.sessionuniversitaire.SessionUniversitaire;
import com.m2GDIL.backend_uniprojet.sessionuniversitaire.SessionUniversitaireRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SujetService {

    private final SujetRepository sujetRepository;
    private final EnseignantRepository enseignantRepository;
    private final SessionUniversitaireRepository sessionRepository;

    public SujetService(
            SujetRepository sujetRepository,
            EnseignantRepository enseignantRepository,
            SessionUniversitaireRepository sessionRepository) {
        this.sujetRepository = sujetRepository;
        this.enseignantRepository = enseignantRepository;
        this.sessionRepository = sessionRepository;
    }

    private void valider(Sujet sujet) {
        if (sujet.getReference() == null
                || sujet.getReference().isBlank()) {
            throw new IllegalArgumentException(
                "La reference est obligatoire.");
        }

        if (sujet.getTitre() == null || sujet.getTitre().isBlank()) {
            throw new IllegalArgumentException(
                "Le titre est obligatoire.");
        }

        if (sujet.getCapaciteMax() == null
                || sujet.getCapaciteMax() <= 0) {
            throw new IllegalArgumentException(
                "La capacite maximale doit etre superieure a zero.");
        }
    }

    @Transactional
    public Sujet creer(
            Sujet donnees, Long enseignantId, Long sessionId) {

        valider(donnees);

        Enseignant enseignant = enseignantRepository.findById(enseignantId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Enseignant introuvable : " + enseignantId));

        SessionUniversitaire session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Session universitaire introuvable : " + sessionId));

        String reference = donnees.getReference().trim();

        if (sujetRepository
                .existsByReferenceAndSessionUniversitaireId(
                    reference, sessionId)) {
            throw new IllegalArgumentException(
                "Cette reference existe deja dans cette session.");
        }

        donnees.setReference(reference);
        donnees.setTitre(donnees.getTitre().trim());
        donnees.setEnseignant(enseignant);
        donnees.setSessionUniversitaire(session);

        if (donnees.getDisponible() == null) {
            donnees.setDisponible(true);
        }

        return sujetRepository.save(donnees);
    }

    public List<Sujet> obtenirTous() {
        return sujetRepository.findAll();
    }

    public Sujet obtenirParId(Long id) {
        return sujetRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException(
                "Sujet introuvable : " + id));
    }

    public List<Sujet> obtenirParEnseignant(Long enseignantId) {
        return sujetRepository.findByEnseignantId(enseignantId);
    }

    public List<Sujet> obtenirParSession(Long sessionId) {
        return sujetRepository.findBySessionUniversitaireId(sessionId);
    }

    public List<Sujet> obtenirParDisponibilite(Boolean disponible) {
        return sujetRepository.findByDisponible(disponible);
    }

    public List<Sujet> obtenirParNiveau(String niveau) {
        return sujetRepository.findByNiveauIgnoreCase(niveau);
    }

    @Transactional
    public Sujet modifier(Long id, Sujet donnees) {
        Sujet sujet = obtenirParId(id);

        if (donnees.getReference() != null
                && !donnees.getReference().isBlank()) {
            sujet.setReference(donnees.getReference().trim());
        }

        if (donnees.getTitre() != null
                && !donnees.getTitre().isBlank()) {
            sujet.setTitre(donnees.getTitre().trim());
        }

        if (donnees.getDescription() != null) {
            sujet.setDescription(donnees.getDescription());
        }

        if (donnees.getObjectifs() != null) {
            sujet.setObjectifs(donnees.getObjectifs());
        }

        if (donnees.getNiveau() != null) {
            sujet.setNiveau(donnees.getNiveau());
        }

        if (donnees.getCapaciteMax() != null) {
            if (donnees.getCapaciteMax() <= 0) {
                throw new IllegalArgumentException(
                    "La capacite maximale doit etre superieure a zero.");
            }
            sujet.setCapaciteMax(donnees.getCapaciteMax());
        }

        if (donnees.getDisponible() != null) {
            sujet.setDisponible(donnees.getDisponible());
        }

        valider(sujet);

        boolean referenceExiste =
            sujetRepository.existsByReferenceAndSessionUniversitaireId(
                sujet.getReference(),
                sujet.getSessionUniversitaire().getId());

        if (referenceExiste) {
            Sujet autre = sujetRepository
                .findByReferenceAndSessionUniversitaireId(
                    sujet.getReference(),
                    sujet.getSessionUniversitaire().getId())
                .orElse(null);

            if (autre != null && !autre.getId().equals(id)) {
                throw new IllegalArgumentException(
                    "Cette reference est deja utilisee dans cette session.");
            }
        }

        return sujetRepository.save(sujet);
    }

    @Transactional
    public void supprimer(Long id) {
        Sujet sujet = obtenirParId(id);
        sujetRepository.delete(sujet);
    }

    public long compter() {
        return sujetRepository.count();
    }
}
