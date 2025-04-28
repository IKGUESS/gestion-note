package com.example.Gestion_Etudiants.NoteNormaleEtd;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface noteNormaleRepository extends JpaRepository<noteNormaleEtd, Long> {

    @Query("SELECT n FROM noteNormaleEtd n JOIN FETCH n.etudiant WHERE n.etudiant.cin = :cin")
    List<noteNormaleEtd> findByEtudiant_Cin(@Param("cin") String cin);

    @Query("SELECT n FROM noteNormaleEtd n JOIN FETCH n.etudiant")
    List<noteNormaleEtd> findAllWithEtudiant();

    @Query("SELECT n FROM noteNormaleEtd n WHERE n.etudiant.cin = :cin AND n.module.codeMod = :codeMod")
    noteNormaleEtd findByEtudiant_CinAndModule_codeMod(@Param("cin") String cin, @Param("codeMod") String codeMod);

    @Query("SELECT n FROM noteNormaleEtd n WHERE n.etudiant.cin = :cin AND n.module.codeMod = :codeMod AND n.session = :session")
    noteNormaleEtd findByEtudiant_CinAndModule_codeModAndSession(@Param("cin") String cin,
                                                                 @Param("codeMod") String codeMod,
                                                                 @Param("session") String session);

    List<noteNormaleEtd> findByResultatNot(String resultat);

    void deleteByEtudiant_Cin(String cin);

}