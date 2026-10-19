
package com.m2GDIL.backend_uniprojet.enseignant;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enseignants")
public class EnseignantController {

    private final EnseignantService enseignantService;

    public EnseignantController(EnseignantService enseignantService) {
        this.enseignantService = enseignantService;
    }

    // Creer un profil enseignant
    @PostMapping
    public Enseignant creer(
            @Valid @RequestBody Enseignant enseignant,
            @RequestParam Long utilisateurId) {
        return enseignantService.creer(enseignant, utilisateurId);
    }

    // Lister tous les enseignants
    @GetMapping
    public List<Enseignant> obtenirTous() {
        return enseignantService.obtenirTous();
    }

    // Consulter par identifiant
    @GetMapping("/{id}")
    public Enseignant obtenirParId(@PathVariable Long id) {
        return enseignantService.obtenirParId(id);
    }

    // Rechercher par matricule
    @GetMapping("/matricule")
    public Enseignant obtenirParMatricule(
            @RequestParam String valeur) {
        return enseignantService.obtenirParMatricule(valeur);
    }

    // Rechercher par compte utilisateur
    @GetMapping("/utilisateur/{utilisateurId}")
    public Enseignant obtenirParUtilisateur(
            @PathVariable Long utilisateurId) {
        return enseignantService.obtenirParUtilisateur(utilisateurId);
    }

    // Rechercher par specialite
    @GetMapping("/specialite")
    public List<Enseignant> obtenirParSpecialite(
            @RequestParam String valeur) {
        return enseignantService.obtenirParSpecialite(valeur);
    }

    // Rechercher par departement
    @GetMapping("/departement")
    public List<Enseignant> obtenirParDepartement(
            @RequestParam String valeur) {
        return enseignantService.obtenirParDepartement(valeur);
    }

    
    // Modifier un profil enseignant
    @PutMapping("/{id}")
    public Enseignant modifier(
            @PathVariable Long id,
            @Valid @RequestBody Enseignant donnees) {

        return enseignantService.modifier(id, donnees);
    }


    // Supprimer un profil
    @DeleteMapping("/{id}")
    public Map<String, String> supprimer(@PathVariable Long id) {
        enseignantService.supprimer(id);
        return Map.of("message", "Profil enseignant supprime.");
    }

    // Compter les enseignants
    @GetMapping("/statistiques/nombre")
    public Map<String, Long> compter() {
        return Map.of(
            "nombreEnseignants",
            enseignantService.compter()
        );
    }
}
