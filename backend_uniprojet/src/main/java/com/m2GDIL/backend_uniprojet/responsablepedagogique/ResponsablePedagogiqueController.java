
package com.m2GDIL.backend_uniprojet.responsablepedagogique;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/responsables-pedagogiques")
public class ResponsablePedagogiqueController {

    private final ResponsablePedagogiqueService responsableService;

    public ResponsablePedagogiqueController(
            ResponsablePedagogiqueService responsableService) {
        this.responsableService = responsableService;
    }

    @PostMapping
    public ResponsablePedagogique creer(
            @RequestParam Long utilisateurId) {
        return responsableService.creer(utilisateurId);
    }

    @GetMapping
    public List<ResponsablePedagogique> obtenirTous() {
        return responsableService.obtenirTous();
    }

    @GetMapping("/{id}")
    public ResponsablePedagogique obtenirParId(@PathVariable Long id) {
        return responsableService.obtenirParId(id);
    }

    @GetMapping("/utilisateur/{utilisateurId}")
    public ResponsablePedagogique obtenirParUtilisateur(
            @PathVariable Long utilisateurId) {
        return responsableService.obtenirParUtilisateur(utilisateurId);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> supprimer(@PathVariable Long id) {
        responsableService.supprimer(id);

        return Map.of(
            "message",
            "Profil responsable pedagogique supprime."
        );
    }

    @GetMapping("/statistiques/nombre")
    public Map<String, Long> compter() {
        return Map.of(
            "nombreResponsablesPedagogiques",
            responsableService.compter()
        );
    }
}
