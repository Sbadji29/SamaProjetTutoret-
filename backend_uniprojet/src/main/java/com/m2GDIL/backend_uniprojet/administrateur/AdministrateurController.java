
package com.m2GDIL.backend_uniprojet.administrateur;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/administrateurs")
public class AdministrateurController {

    private final AdministrateurService administrateurService;

    public AdministrateurController(
            AdministrateurService administrateurService) {
        this.administrateurService = administrateurService;
    }

    // Creer un profil administrateur
    @PostMapping
    public Administrateur creer(
            @RequestParam Long utilisateurId) {
        return administrateurService.creer(utilisateurId);
    }

    // Lister les administrateurs
    @GetMapping
    public List<Administrateur> obtenirTous() {
        return administrateurService.obtenirTous();
    }

    // Consulter par identifiant
    @GetMapping("/{id}")
    public Administrateur obtenirParId(@PathVariable Long id) {
        return administrateurService.obtenirParId(id);
    }

    // Rechercher par compte utilisateur
    @GetMapping("/utilisateur/{utilisateurId}")
    public Administrateur obtenirParUtilisateur(
            @PathVariable Long utilisateurId) {
        return administrateurService.obtenirParUtilisateur(utilisateurId);
    }

    // Supprimer un profil
    @DeleteMapping("/{id}")
    public Map<String, String> supprimer(@PathVariable Long id) {
        administrateurService.supprimer(id);

        return Map.of(
            "message",
            "Profil administrateur supprime."
        );
    }

    // Compter les administrateurs
    @GetMapping("/statistiques/nombre")
    public Map<String, Long> compter() {
        return Map.of(
            "nombreAdministrateurs",
            administrateurService.compter()
        );
    }
}
