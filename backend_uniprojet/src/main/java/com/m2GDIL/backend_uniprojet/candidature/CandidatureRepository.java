
package com.m2GDIL.backend_uniprojet.candidature;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidatureRepository
        extends JpaRepository<Candidature, Long> {

    boolean existsByEtudiantIdAndSujetIdAndSessionUniversitaireId(
        Long etudiantId,
        Long sujetId,
        Long sessionId
    );

    List<Candidature> findByEtudiantId(Long etudiantId);

    List<Candidature> findBySujetId(Long sujetId);

    List<Candidature> findBySessionUniversitaireId(Long sessionId);

    List<Candidature> findByStatut(StatutCandidature statut);

    List<Candidature> findByEtudiantIdAndSessionUniversitaireIdOrderByPrioriteAsc(
        Long etudiantId,
        Long sessionId
    );
}
