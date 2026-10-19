
package com.m2GDIL.backend_uniprojet.etudiant;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EtudiantRepository
        extends JpaRepository<Etudiant, Long> {

    Optional<Etudiant> findByNumeroEtudiant(
        String numeroEtudiant
    );

    boolean existsByNumeroEtudiant(String numeroEtudiant);

    boolean existsByUtilisateurId(Long utilisateurId);

    Optional<Etudiant> findByUtilisateurId(Long utilisateurId);

    List<Etudiant> findByFiliereIgnoreCase(String filiere);

    List<Etudiant> findByNiveauIgnoreCase(String niveau);
}
