# LMS App

Aplikasi Learning Management System berbasis Laravel, Inertia, React, dan Tailwind CSS. Aplikasi ini memiliki fitur pembelajaran, kuis pre-test/post-test, penyimpanan hasil kuis ke database, serta halaman admin untuk mengelola konten dan melihat nilai siswa.

## Teknologi

- PHP >= 8.2
- Laravel 12
- Inertia.js
- React
- Tailwind CSS
- MySQL
- Vite

## Persiapan Aman

Jangan commit file `.env`, credential database, token API, atau file sensitif lain ke repository. Gunakan `.env.example` sebagai template konfigurasi.

Pastikan file berikut tetap tidak masuk commit:

```bash
.env
storage/*.key
node_modules
vendor
```

## Instalasi Lokal

Clone repository, lalu masuk ke folder project:

```bash
git clone <repo-url>
cd lms-app
```

Install dependency PHP dan JavaScript:

```bash
composer install
npm install
```

Salin environment template:

```bash
copy .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

Atur koneksi database di `.env` sesuai database lokal masing-masing:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database
DB_USERNAME=username_database
DB_PASSWORD=password_database
```

Jalankan migrasi dan seeder:

```bash
php artisan migrate --seed
```

## Menjalankan Aplikasi

Jalankan server Laravel:

```bash
php artisan serve
```

Jalankan Vite di terminal lain:

```bash
npm run dev
```

Buka aplikasi melalui URL yang muncul dari `php artisan serve`, biasanya:

```bash
http://127.0.0.1:8000
```

## Build Production

Untuk membuat asset frontend production:

```bash
npm run build
```

## Testing

Jalankan test Laravel:

```bash
php artisan test
```

Untuk test fitur kuis:

```bash
php artisan test tests/Feature/QuizAttemptTest.php
```

Catatan: pastikan PHP CLI yang aktif sudah versi 8.2 atau lebih baru. Jika muncul error dependency PHP, cek versi dengan:

```bash
php -v
```

## Fitur Utama

- Login dan register user.
- Role admin dan student.
- Halaman pembelajaran per pertemuan.
- Kuis pre-test dan post-test.
- Hasil kuis disimpan ke database.
- User hanya bisa mengerjakan setiap kuis satu kali.
- Nilai kuis tampil di halaman list kuis user.
- Admin dapat melihat rekap hasil kuis per tes.
- Admin dapat mengelola user, pertemuan, quiz set, dan soal kuis.

## Alur Kuis

1. User membuka halaman kuis.
2. User mengerjakan salah satu tes.
3. Saat submit, jawaban dikirim ke backend.
4. Backend menghitung nilai berdasarkan jawaban benar di database.
5. Hasil disimpan di tabel `quiz_attempts`.
6. User diarahkan kembali ke list kuis.
7. Kuis yang sudah dikerjakan akan menampilkan nilai dan tidak bisa dikerjakan ulang.

## Halaman Admin Hasil Kuis

Admin dapat membuka:

```bash
/admin/quiz-results
```

Halaman tersebut menampilkan list tes. Setelah admin memilih salah satu tes, aplikasi membuka halaman detail yang berisi tabel hasil siswa untuk tes tersebut.

## Perintah Berguna

Membersihkan cache Laravel:

```bash
php artisan optimize:clear
```

Menjalankan ulang migrasi dari awal:

```bash
php artisan migrate:fresh --seed
```

Membuat symbolic link storage:

```bash
php artisan storage:link
```

## Catatan Keamanan

- Jangan taruh password asli di README.
- Jangan commit `.env`.
- Jangan tampilkan `correct_option` ke frontend user.
- Validasi submit kuis harus tetap dilakukan di backend.
- Batas satu kali pengerjaan kuis dijaga oleh database unique constraint.
- Gunakan akun admin hanya untuk pengelolaan data.

## Troubleshooting

Jika asset frontend tidak berubah:

```bash
npm run dev
```

Jika route atau config terasa belum update:

```bash
php artisan optimize:clear
```

Jika migrasi gagal karena tabel sudah ada, gunakan database baru atau jalankan:

```bash
php artisan migrate:fresh --seed
```

Perintah `migrate:fresh` akan menghapus seluruh tabel dan data pada database yang sedang dipakai.
