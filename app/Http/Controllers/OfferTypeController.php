<?php

namespace App\Http\Controllers;

use App\Models\OfferType;
use Illuminate\Http\Request;

class OfferTypeController extends Controller
{
    public function index()
    {
        return OfferType::all(['id', 'name']);
    }
}
