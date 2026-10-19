
package com.m2GDIL.backend_uniprojet.administrateur;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdministrateurRepository
        extends JpaRepository<Administrateur, Long> {

    Optional<Administrateur> findByUtilisateurId(Long utilisateurId);

    boolean existsByUtilisateurId(Long utilisateurId);
}
