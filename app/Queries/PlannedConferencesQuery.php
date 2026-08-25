<?php

namespace App\Queries;

use App\Enums\ConferenceStateEnum;
use App\Models\Conference;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class PlannedConferencesQuery
{
    public static function base(): Builder
    {
        $query = Conference::query()
            ->whereIn('state_id', [ConferenceStateEnum::PLANNED, ConferenceStateEnum::ACTIVE])
            ->with('proposal')
            ->leftJoin('proposals', 'conferences.id', '=', 'proposals.conference_id');

        static::applyFutureFinishDateFilter($query);

        return $query->select('conferences.*')->distinct();
    }

    public static function applyFutureFinishDateFilter(Builder $query): void
    {
        $today = now()->toDateString();
        $dbDriver = config('database.default');

        if ($dbDriver === 'sqlite') {
            $query->whereRaw(
                "date(COALESCE(json_extract(proposals.payload, '$.endDate'), conferences.date)) >= date(?)",
                [$today]
            );

            return;
        }

        if ($dbDriver === 'mysql') {
            $query->whereRaw(
                'COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(proposals.payload, "$.endDate")) AS DATE), conferences.date) >= ?',
                [$today]
            );

            return;
        }

        $query->whereRaw(
            "COALESCE(CAST(proposals.payload->>'endDate' AS DATE), conferences.date) >= ?",
            [$today]
        );
    }

    public static function applyDefaultOrdering(Builder $query): void
    {
        $dbDriver = config('database.default');

        if ($dbDriver === 'sqlite') {
            $query->orderByRaw("date(json_extract(proposals.payload, '$.date')) ASC");

            return;
        }

        if ($dbDriver === 'mysql') {
            $query->orderByRaw('CAST(JSON_UNQUOTE(JSON_EXTRACT(proposals.payload, "$.date")) AS DATE) ASC');

            return;
        }

        $query->orderByRaw("CAST(proposals.payload->>'date' AS DATE) ASC");
    }

    /**
     * @return Collection<int, Conference>
     */
    public static function getForExport(): Collection
    {
        $query = static::base();
        static::applyDefaultOrdering($query);

        return $query->get();
    }
}
