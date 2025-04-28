package com.example.Gestion_Etudiants.NoteRattEtd;

import com.example.Gestion_Etudiants.NoteNormaleEtd.noteNormaleEtd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.Gestion_Etudiants.Etudiants.Etudiant;
import com.example.Gestion_Etudiants.Modules.Module;
import java.util.List;

@Repository
public interface noteRattEtdRepository extends JpaRepository<noteRattEtd, Long> {

    @Query("SELECT n FROM noteRattEtd n JOIN FETCH n.etudiant WHERE n.etudiant.cin = :cin")
    List<noteRattEtd> findByEtudiant_Cin(@Param("cin") String cin);

    @Query("SELECT n FROM noteRattEtd n JOIN FETCH n.etudiant")
    List<noteRattEtd> findAllWithEtudiant();

    @Query("SELECT n FROM noteRattEtd n WHERE n.etudiant.cin = :cin AND n.module.codeMod = :codeMod")
    noteRattEtd findByEtudiant_CinAndModule_CodeMod(@Param("cin") String cin, @Param("codeMod") String codeMod);

    @Query("SELECT n FROM noteRattEtd n WHERE n.etudiant.cin = :cin AND n.module.codeMod = :codeMod AND n.session = :session")
    noteRattEtd findByEtudiant_CinAndModule_CodeModAndSession(@Param("cin") String cin,
                                                              @Param("codeMod") String codeMod,
                                                              @Param("session") String session);

    @Query("SELECT n FROM noteRattEtd n WHERE n.etudiant = :etudiant AND n.module = :module")
    noteRattEtd findByEtudiantAndModule(@Param("etudiant") Etudiant etudiant,
                                        @Param("module") Module module);
    void deleteByEtudiant_Cin(String cin);

}