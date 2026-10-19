
package com.m2GDIL.backend_uniprojet.affectation;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/affectations")
public class AffectationController {

    private final AffectationService affectationService;

    public AffectationController(
            AffectationService affectationService) {
        this.affectationService = affectationService;
    }

    @PostMapping
    public Affectation creer(
            @RequestParam Long candidatureId) {
        return affectationService.creer(candidatureId);
    }

    @GetMapping
    public List<Affectation> obtenirToutes() {
        return affectationService.obtenirToutes();
    }

    @GetMapping("/{id}")
    public Affectation obtenirParId(@PathVariable Long id) {
        return affectationService.obtenirParId(id);
    }

    @GetMapping("/candidature/{candidatureId}")
    public Affectation obtenirParCandidature(
            @PathVariable Long candidatureId) {
        return affectationService.obtenirParCandidature(candidatureId);
    }

    @GetMapping("/etudiant/{etudiantId}")
    public List<Affectation> obtenirParEtudiant(
            @PathVariable Long etudiantId) {
        return affectationService.obtenirParEtudiant(etudiantId);
    }

    @GetMapping("/sujet/{sujetId}")
    public List<Affectation> obtenirParSujet(
            @PathVariable Long sujetId) {
        return affectationService.obtenirParSujet(sujetId);
    }

    @GetMapping("/statut")
    public List<Affectation> obtenirParStatut(
            @RequestParam StatutAffectation valeur) {
        return affectationService.obtenirParStatut(valeur);
    }

    @PatchMapping("/{id}/statut")
    public Affectation changerStatut(
            @PathVariable Long id,
            @RequestParam StatutAffectation valeur) {
        return affectationService.changerStatut(id, valeur);
    }

    @GetMapping("/statistiques/nombre")
    public Map<String, Long> compter() {
        return Map.of(
            "nombreAffectations",
            affectationService.compter()
        );
    }
}
