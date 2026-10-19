
package com.m2GDIL.backend_uniprojet.affectation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AffectationRepository
        extends JpaRepository<Affectation, Long> {

    Optional<Affectation> findByCandidatureId(Long candidatureId);

    boolean existsByCandidatureId(Long candidatureId);

    List<Affectation> findByEtudiantId(Long etudiantId);

    List<Affectation> findBySujetId(Long sujetId);

    List<Affectation> findByStatut(StatutAffectation statut);
}
