
package com.larppc.demo.repository;

import com.larppc.demo.entity.Tariff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TariffRepository extends JpaRepository<Tariff, Long> {

    List<Tariff> findByRoomIdAndActiveTrue(Long roomId);
}
