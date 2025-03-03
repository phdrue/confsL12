<?php

namespace App\Enums;

enum ConferenceStateEnum: int
{
    case DRAFT = 1;
    case ACTIVE = 2;
    case ARCHIVE = 3;
}
