
package com.m2GDIL.backend_uniprojet.responsablepedagogique;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResponsablePedagogiqueRepository
        extends JpaRepository<ResponsablePedagogique, Long> {

    Optional<ResponsablePedagogique> findByUtilisateurId(
        Long utilisateurId);

    boolean existsByUtilisateurId(Long utilisateurId);
}
