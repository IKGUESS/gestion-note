package com.example.Gestion_Etudiants.Presences;

import com.example.Gestion_Etudiants.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/api/presences")
public class PresenceController {

    private final PresenceService presenceService;

    public PresenceController(PresenceService presenceService) {
        this.presenceService = presenceService;
    }

    @GetMapping
    public List<Presence> getAllPresences() {
        return presenceService.getAllPresences();
    }

    @GetMapping("/etudiant/{cin}")
    public List<Presence> getPresencesByEtudiant(@PathVariable String cin) {
        return presenceService.getPresencesByEtudiant(cin);
    }

    @GetMapping("/etudiant/{cin}/module/{codeMod}")
    public Presence getPresenceByEtudiantAndModule(
            @PathVariable String cin,
            @PathVariable String codeMod) {
        return presenceService.getPresenceByEtudiantAndModule(cin, codeMod);
    }

    @PostMapping
    public Presence createPresence(@RequestBody Presence presence) {
        return presenceService.createPresence(presence);
    }

    @PutMapping("/etudiant/{cin}/module/{codeMod}")
    public Presence updatePresence(
            @PathVariable String cin,
            @PathVariable String codeMod,
            @RequestBody Presence presenceDetails) {
        return presenceService.updatePresence(cin, codeMod, presenceDetails);
    }

    @DeleteMapping("/etudiant/{cin}/module/{codeMod}")
    public ResponseEntity<?> deletePresence(
            @PathVariable String cin,
            @PathVariable String codeMod) {
        try {
            presenceService.deletePresence(cin, codeMod);
            return ResponseEntity.ok().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}