package com.example.Gestion_Etudiants.Responsable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResponsableRepository extends JpaRepository<Responsable, String> {
	Responsable findResponsableByCin(String cin);
}