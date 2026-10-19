
package com.m2GDIL.backend_uniprojet.etudiant;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/etudiants")
public class EtudiantController {

    private final EtudiantService etudiantService;

    public EtudiantController(EtudiantService etudiantService) {
        this.etudiantService = etudiantService;
    }

    // Creer un profil etudiant
    @PostMapping
    public Etudiant creer(
            @Valid @RequestBody Etudiant etudiant,
            @RequestParam Long utilisateurId) {
        return etudiantService.creer(etudiant, utilisateurId);
    }

    // Lister tous les etudiants
    @GetMapping
    public List<Etudiant> obtenirTous() {
        return etudiantService.obtenirTous();
    }

    // Consulter par identifiant
    @GetMapping("/{id}")
    public Etudiant obtenirParId(@PathVariable Long id) {
        return etudiantService.obtenirParId(id);
    }

    // Rechercher par numero etudiant
    @GetMapping("/numero")
    public Etudiant obtenirParNumero(
            @RequestParam String valeur) {
        return etudiantService.obtenirParNumero(valeur);
    }

    // Rechercher par utilisateur
    @GetMapping("/utilisateur/{utilisateurId}")
    public Etudiant obtenirParUtilisateur(
            @PathVariable Long utilisateurId) {
        return etudiantService.obtenirParUtilisateur(utilisateurId);
    }

    // Filtrer par filiere
    @GetMapping("/filiere")
    public List<Etudiant> obtenirParFiliere(
            @RequestParam String valeur) {
        return etudiantService.obtenirParFiliere(valeur);
    }

    // Filtrer par niveau
    @GetMapping("/niveau")
    public List<Etudiant> obtenirParNiveau(
            @RequestParam String valeur) {
        return etudiantService.obtenirParNiveau(valeur);
    }

    // Modifier un profil
    @PutMapping("/{id}")
    public Etudiant modifier(
            @PathVariable Long id,
            @Valid @RequestBody Etudiant donnees) {
        return etudiantService.modifier(id, donnees);
    }

    // Supprimer un profil
    @DeleteMapping("/{id}")
    public Map<String, String> supprimer(@PathVariable Long id) {
        etudiantService.supprimer(id);
        return Map.of("message", "Profil etudiant supprime.");
    }

    // Compter les etudiants
    @GetMapping("/statistiques/nombre")
    public Map<String, Long> compter() {
        return Map.of("nombreEtudiants", etudiantService.compter());
    }
}
