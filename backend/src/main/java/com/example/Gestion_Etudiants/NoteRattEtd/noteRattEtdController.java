package com.example.Gestion_Etudiants.NoteRattEtd;

import com.example.Gestion_Etudiants.NoteNormaleEtd.noteNormaleEtd;
import com.example.Gestion_Etudiants.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/api/notes-rattrapage")
public class noteRattEtdController {

    private final noteRattEtdService noteRattrapageService;

    public noteRattEtdController(noteRattEtdService noteRattrapageService) {
        this.noteRattrapageService = noteRattrapageService;
    }

    @GetMapping
    public List<noteRattEtd> getAllNotes() {
        return noteRattrapageService.getAllNotes();
    }

    @GetMapping("/etudiant/{cin}")
    public List<noteRattEtd> getNotesByEtudiant(@PathVariable String cin) {
        return noteRattrapageService.getNotesByEtudiant(cin);
    }

    @GetMapping("/etudiant/{cin}/module/{codeMod}")
    public noteRattEtd getNoteByEtudiantAndModule(
            @PathVariable String cin,
            @PathVariable String codeMod) {
        return noteRattrapageService.getNoteByEtudiantAndModule(cin, codeMod);
    }

    @GetMapping("/etudiant/{cin}/module/{codeMod}/session/{session}")
    public noteRattEtd getNoteByEtudiantModuleAndSession(
            @PathVariable String cin,
            @PathVariable String codeMod,
            @PathVariable String session) {
        return noteRattrapageService.getNoteByEtudiantModuleAndSession(cin, codeMod, session);
    }

    @PostMapping("/etudiant/{cin}/module/{codeMod}")
    public ResponseEntity<?> createNoteRattrapage(
            @PathVariable String cin,
            @PathVariable String codeMod) {
        try {
            noteRattEtd createdNote = noteRattrapageService.createNoteRattrapage(cin, codeMod);
            return ResponseEntity.ok(createdNote);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/etudiant/{cin}/module/{codeMod}")
    public noteRattEtd updateNote(
            @PathVariable String cin,
            @PathVariable String codeMod,
            @RequestBody noteRattEtd noteDetails) {
        return noteRattrapageService.updateNote(cin, codeMod, noteDetails);
    }

    @PutMapping("/moyenne/etudiant/{cin}/module/{codeMod}")
    public ResponseEntity<String> updateMoyenne(
            @PathVariable String cin,
            @PathVariable String codeMod,
            @RequestParam double moyenne,
            @RequestParam String resultat) {
        noteRattrapageService.updateMoyenne(cin, codeMod, moyenne, resultat);
        return ResponseEntity.ok("Moyenne mise à jour avec succès");
    }

    @DeleteMapping("/etudiant/{cin}/module/{codeMod}")
    public ResponseEntity<?> deleteNote(
            @PathVariable String cin,
            @PathVariable String codeMod) {
        try {
            noteRattrapageService.deleteNote(cin, codeMod);
            return ResponseEntity.ok().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/remove-non-rattrapage-students")
    public void removeNonRattrapageStudents() {
        noteRattrapageService.removeNonRattrapageStudents();
    }


}