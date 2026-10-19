
package com.m2GDIL.backend_uniprojet.enseignant;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EnseignantRepository
        extends JpaRepository<Enseignant, Long> {

    Optional<Enseignant> findByMatricule(String matricule);
   
    boolean existsByMatricule(String matricule);

    boolean existsByUtilisateurId(Long utilisateurId);

    Optional<Enseignant> findByUtilisateurId(Long utilisateurId);

    List<Enseignant> findBySpecialiteContainingIgnoreCase(
        String specialite
    );

    List<Enseignant> findByDepartementIgnoreCase(
        String departement
    );
}
