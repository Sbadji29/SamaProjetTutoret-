
package com.m2GDIL.backend_uniprojet.sessionuniversitaire;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SessionUniversitaireRepository
        extends JpaRepository<SessionUniversitaire, Long> {

    Optional<SessionUniversitaire> findByLibelleIgnoreCase(
        String libelle);

    boolean existsByLibelleIgnoreCase(String libelle);

    List<SessionUniversitaire> findByActive(Boolean active);
}
