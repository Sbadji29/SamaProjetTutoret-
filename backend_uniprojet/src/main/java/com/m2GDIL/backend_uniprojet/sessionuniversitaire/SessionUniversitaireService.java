
package com.m2GDIL.backend_uniprojet.sessionuniversitaire;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SessionUniversitaireService {

    private final SessionUniversitaireRepository sessionRepository;

    public SessionUniversitaireService(
            SessionUniversitaireRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    private void valider(SessionUniversitaire session) {

        if (session.getLibelle() == null
                || session.getLibelle().isBlank()) {
            throw new IllegalArgumentException(
                "Le libelle est obligatoire.");
        }

        if (session.getDateDebut() == null
                || session.getDateFin() == null) {
            throw new IllegalArgumentException(
                "Les dates de debut et de fin sont obligatoires.");
        }

        if (session.getDateFin().isBefore(session.getDateDebut())) {
            throw new IllegalArgumentException(
                "La date de fin doit etre posterieure ou egale a la date de debut.");
        }

        if (session.getDateClotureVoeux() != null
                && session.getDateClotureVoeux().toLocalDate()
                    .isBefore(session.getDateDebut())) {
            throw new IllegalArgumentException(
                "La cloture des voeux ne peut pas preceder le debut de la session.");
        }

        if (session.getDateLimiteEvaluation() != null
                && session.getDateLimiteEvaluation().toLocalDate()
                    .isAfter(session.getDateFin())) {
            throw new IllegalArgumentException(
                "La limite d'evaluation ne peut pas depasser la fin de la session.");
        }
    }

    @Transactional
    public SessionUniversitaire creer(SessionUniversitaire session) {

        session.setLibelle(session.getLibelle().trim());
        valider(session);

        if (sessionRepository.existsByLibelleIgnoreCase(
                session.getLibelle())) {
            throw new IllegalArgumentException(
                "Une session portant ce libelle existe deja.");
        }

        if (session.getActive() == null) {
            session.setActive(false);
        }

        return sessionRepository.save(session);
    }

    public List<SessionUniversitaire> obtenirToutes() {
        return sessionRepository.findAll();
    }

    public SessionUniversitaire obtenirParId(Long id) {
        return sessionRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException(
                "Session universitaire introuvable : " + id));
    }

    public SessionUniversitaire obtenirParLibelle(String libelle) {
        return sessionRepository.findByLibelleIgnoreCase(libelle)
            .orElseThrow(() -> new IllegalArgumentException(
                "Session universitaire introuvable pour ce libelle."));
    }

    public List<SessionUniversitaire> obtenirParEtat(Boolean active) {
        return sessionRepository.findByActive(active);
    }

    @Transactional
    public SessionUniversitaire modifier(
            Long id, SessionUniversitaire donnees) {

        SessionUniversitaire session = obtenirParId(id);

        if (donnees.getLibelle() != null
                && !donnees.getLibelle().isBlank()) {
            session.setLibelle(donnees.getLibelle().trim());
        }

        if (donnees.getDateDebut() != null) {
            session.setDateDebut(donnees.getDateDebut());
        }

        if (donnees.getDateFin() != null) {
            session.setDateFin(donnees.getDateFin());
        }

        if (donnees.getDateClotureVoeux() != null) {
            session.setDateClotureVoeux(
                donnees.getDateClotureVoeux());
        }

        if (donnees.getDateLimiteEvaluation() != null) {
            session.setDateLimiteEvaluation(
                donnees.getDateLimiteEvaluation());
        }

        if (donnees.getActive() != null) {
            session.setActive(donnees.getActive());
        }

        valider(session);

        String libelle = session.getLibelle();

        if (sessionRepository.existsByLibelleIgnoreCase(libelle)) {
            SessionUniversitaire autre =
                sessionRepository.findByLibelleIgnoreCase(libelle)
                    .orElse(null);

            if (autre != null && !autre.getId().equals(id)) {
                throw new IllegalArgumentException(
                    "Une autre session utilise deja ce libelle.");
            }
        }

        return sessionRepository.save(session);
    }

    @Transactional
    public void supprimer(Long id) {
        SessionUniversitaire session = obtenirParId(id);
        sessionRepository.delete(session);
    }

    public long compter() {
        return sessionRepository.count();
    }
}
