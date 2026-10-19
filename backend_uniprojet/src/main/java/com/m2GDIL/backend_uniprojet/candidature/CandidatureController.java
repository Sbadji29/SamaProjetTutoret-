
package com.m2GDIL.backend_uniprojet.candidature;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/candidatures")
public class CandidatureController {

    private final CandidatureService candidatureService;

    public CandidatureController(
            CandidatureService candidatureService) {
        this.candidatureService = candidatureService;
    }

    @PostMapping
    public Candidature creer(
            @RequestBody Candidature candidature,
            @RequestParam Long etudiantId,
            @RequestParam Long sujetId,
            @RequestParam Long sessionId) {

        return candidatureService.creer(
            candidature, etudiantId, sujetId, sessionId);
    }

    @GetMapping
    public List<Candidature> obtenirToutes() {
        return candidatureService.obtenirToutes();
    }

    @GetMapping("/{id}")
    public Candidature obtenirParId(@PathVariable Long id) {
        return candidatureService.obtenirParId(id);
    }

    @GetMapping("/etudiant/{etudiantId}")
    public List<Candidature> obtenirParEtudiant(
            @PathVariable Long etudiantId) {
        return candidatureService.obtenirParEtudiant(etudiantId);
    }

    @GetMapping("/sujet/{sujetId}")
    public List<Candidature> obtenirParSujet(
            @PathVariable Long sujetId) {
        return candidatureService.obtenirParSujet(sujetId);
    }

    @GetMapping("/session/{sessionId}")
    public List<Candidature> obtenirParSession(
            @PathVariable Long sessionId) {
        return candidatureService.obtenirParSession(sessionId);
    }

    @GetMapping("/statut")
    public List<Candidature> obtenirParStatut(
            @RequestParam StatutCandidature valeur) {
        return candidatureService.obtenirParStatut(valeur);
    }

    @GetMapping("/etudiant/{etudiantId}/session/{sessionId}/voeux")
    public List<Candidature> obtenirVoeux(
            @PathVariable Long etudiantId,
            @PathVariable Long sessionId) {
        return candidatureService.obtenirVoeuxEtudiant(
            etudiantId, sessionId);
    }

    @PutMapping("/{id}")
    public Candidature modifier(
            @PathVariable Long id,
            @RequestBody Candidature donnees) {
        return candidatureService.modifier(id, donnees);
    }

    @PatchMapping("/{id}/statut")
    public Candidature changerStatut(
            @PathVariable Long id,
            @RequestParam StatutCandidature valeur) {
        return candidatureService.changerStatut(id, valeur);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> supprimer(@PathVariable Long id) {
        candidatureService.supprimer(id);
        return Map.of("message", "Candidature supprimee.");
    }

    @GetMapping("/statistiques/nombre")
    public Map<String, Long> compter() {
        return Map.of(
            "nombreCandidatures",
            candidatureService.compter()
        );
    }
}
