package com.example.Gestion_Etudiants.NoteNormaleEtd;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/api/notes-normales")
public class noteNormaleController {

    private final noteNormaleService noteService;

    public noteNormaleController(noteNormaleService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public List<noteNormaleEtd> getAllNotes() {
        return noteService.getAllNotes();
    }

    @GetMapping("/etudiant/{cin}")
    public List<noteNormaleEtd> getNotesByEtudiant(@PathVariable String cin) {
        return noteService.getNotesByEtudiant(cin);
    }

    @GetMapping("/etudiant/{cin}/module/{codeMod}")
    public noteNormaleEtd getNoteByEtudiantAndModule(
            @PathVariable String cin,
            @PathVariable String codeMod) {
        return noteService.getNoteByEtudiantAndModule(cin, codeMod);
    }

    @GetMapping("/etudiant/{cin}/module/{codeMod}/session/{session}")
    public noteNormaleEtd getNoteByEtudiantModuleAndSession(
            @PathVariable String cin,
            @PathVariable String codeMod,
            @PathVariable String session) {
        return noteService.getNoteByEtudiantModuleAndSession(cin, codeMod, session);
    }

    @PostMapping
    public noteNormaleEtd createNote(@RequestBody noteNormaleEtd note) {
        return noteService.createNote(note);
    }

    @PutMapping("/etudiant/{cin}/module/{codeMod}")
    public noteNormaleEtd updateNote(
            @PathVariable String cin,
            @PathVariable String codeMod,
            @RequestBody noteNormaleEtd noteDetails) {
        return noteService.updateNote(cin, codeMod, noteDetails);
    }

    @PutMapping("/moyenne/etudiant/{cin}/module/{codeMod}")
    public ResponseEntity<String> updateMoyenne(
            @PathVariable String cin,
            @PathVariable String codeMod,
            @RequestParam double moyenne,
            @RequestParam String resultat) {
        noteService.updateMoyenne(cin, codeMod, moyenne, resultat);
        return ResponseEntity.ok("Moyenne mise à jour avec succès");
    }
}