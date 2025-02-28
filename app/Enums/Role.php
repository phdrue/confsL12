<?php

namespace App\Enums;

enum Role: int
{
    case USER = 1;
    case ADMIN = 2;
    case RESPONSIBLE = 3;
}
