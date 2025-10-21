<?php

namespace App\Enums;

enum ConferenceStateEnum: int
{
    case DRAFT = 1;
    case PLANNED = 2;
    case ACTIVE = 3;
    case ARCHIVE = 4;
}
