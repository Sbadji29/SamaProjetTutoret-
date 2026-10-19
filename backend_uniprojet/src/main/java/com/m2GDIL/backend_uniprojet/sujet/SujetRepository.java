
package com.m2GDIL.backend_uniprojet.sujet;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SujetRepository extends JpaRepository<Sujet, Long> {

    Optional<Sujet> findByReferenceAndSessionUniversitaireId(
        String reference, Long sessionId);

    boolean existsByReferenceAndSessionUniversitaireId(
        String reference, Long sessionId);

    List<Sujet> findByEnseignantId(Long enseignantId);

    List<Sujet> findBySessionUniversitaireId(Long sessionId);

    List<Sujet> findByDisponible(Boolean disponible);

    List<Sujet> findByNiveauIgnoreCase(String niveau);
}
