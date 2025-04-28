package com.example.Gestion_Etudiants.Inscriptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/inscriptions")
public class InscriptionController {

    private final InscriptionService inscriptionService;

    public InscriptionController(InscriptionService inscriptionService) {
        this.inscriptionService = inscriptionService;
    }

    @GetMapping
    public List<Inscription> getAllInscriptions() {
        return inscriptionService.getAllInscriptions();
    }

    @GetMapping("/{cin}")
    public Inscription getInscriptionById(@PathVariable String cin) {
        return inscriptionService.getInscriptionById(cin);
    }

    @PostMapping
    public Inscription createInscription(@RequestBody Inscription inscription) {
        return inscriptionService.createInscription(inscription);
    }

    @PutMapping("/{cin}")
    public Inscription updateInscription(@PathVariable String cin, @RequestBody Inscription inscription) {
        return inscriptionService.updateInscription(cin, inscription);
    }

    @DeleteMapping("/{cin}")
    public ResponseEntity<?> deleteInscription(@PathVariable String cin) {
        inscriptionService.deleteInscription(cin);
        return ResponseEntity.ok().build();
    }
}