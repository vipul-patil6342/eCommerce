package com.vipulpatil.eCommerce.entity.type;

import java.time.LocalDateTime;

public enum DashboardRange {

    WEEK {
        @Override
        public LocalDateTime getStartDate(){
            return LocalDateTime.now().minusDays(7);
        }
    },
    MONTH {
        @Override
        public LocalDateTime getStartDate(){
            return LocalDateTime.now().minusMonths(1);
        }
    },
    YEAR {
        @Override
        public LocalDateTime getStartDate(){
            return LocalDateTime.now().minusYears(1);
        }
    };

    public abstract LocalDateTime getStartDate();
}
