export const BANKS_CONTENT = (accountNumber: string = '700701540642769423') => {
  const banks = [
    {
      bank_code: 'BRI',
      note: [
        {
          name: 'ATM',
          steps: [
            {
              name: 'Langkah 1: Temukan Atm Terdekat',
              step: [
                <>Masukkan kartu, pilih bahasa lalu masukkan PIN anda</>,
                <>
                  Pilih {'"'}Menu Lainnya{'"'} dan pilih {'"'}Pembayaran{'"'}
                </>,
                <>
                  Pilih {'"'}Pembayaran Lain{'"'} dan pilih {'"'}Briva{'"'}
                </>
              ]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>
                  Masukkan nomor akun virtual <strong className='text-primary-main'>{accountNumber}</strong> dan nominal
                  yang ingin anda bayarkan
                </>,
                <>
                  Periksa data transaksi dan tekan {'"'}YES{'"'}
                </>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini mungkin memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        },
        {
          name: 'Ibanking',
          steps: [
            {
              name: 'Langkah 1: Masuk ke akun anda',
              step: [
                <>
                  Login ke{' '}
                  <a
                    href='https://ib.bri.co.id/ib-bri'
                    target='_blank'
                    className='font-semibold text-primary-main'
                    rel='noreferrer'
                  >
                    https://ib.bri.co.id/ib-bri
                  </a>{' '}
                  , masukkan USER ID dan Password anda
                </>,
                <>
                  Pilih {'"'}Payment{'"'} dan pilih {'"'}Briva{'"'}
                </>
              ]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>
                  Masukkan Nomor Virtual Account anda <strong className='text-primary-main'>{accountNumber}</strong>,
                  masukkan jumlah yang ingin anda bayarkan, dan klik kirim
                </>,
                <>Masukkan kembali kata sandi anda beserta kode autentikasi dari internet bank mToken</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini mungkin memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        },
        {
          name: 'Mbanking',
          steps: [
            {
              name: 'Langkah 1: Masuk ke akun anda',
              step: [
                <>Login ke BRI Mobile Banking, masukkan USER ID dan PIN anda</>,
                <>
                  Pilih {'"'}Payment{'"'} dan pilih {'"'}Briva{'"'}
                </>
              ]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>
                  Masukkan Nomor Virtual Account anda <strong className='text-primary-main'>{accountNumber}</strong>,
                  dan jumlah yang ingin anda bayar
                </>,
                <>
                  Masukkan PIN anda dan klik {'"'}Send{'"'}
                </>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini mungkin memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        }
      ]
    },
    {
      bank_code: 'BCA',
      note: [
        {
          name: 'ATM',
          steps: [
            {
              name: 'Langkah 1: Temukan Atm Terdekat',
              step: [<>Masukkan kartu ATM BCA dan PIN anda</>, <>Masukkan PIN ATM anda</>]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>
                  Pilih {'"'}Transaksi Lainnya{'"'}
                </>,
                <>
                  Pilih {'"'}Transfer{'"'}
                </>,
                <>
                  Pilih {'"'}Ke BCA Virtual Account{'"'}
                </>,
                <>
                  Pilih {'"'}Penagihan Akun Virtual{'"'}
                </>,
                <>
                  Masukkan nomor akun virtual <strong className='text-primary-main'>{accountNumber}</strong> Tekan {'"'}
                  Benar{'"'} untuk melanjutkan
                </>,
                <>
                  Verifikasi detail Virtual Account lalu masukkan jumlah yang akan ditransfer dan pilih {'"'}Benar{'"'}{' '}
                  untuk konfirmasi
                </>,
                <>Konfirmasi detail transaksi anda ditampilkan</>,
                <>
                  Pilih {'"'}Ya{'"'} jika detailnya benar atau {'"'}Tidak{'"'} jika detailnya salah
                </>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>
                  Anda telah menyelesaikan transaksi anda. Pilih {'"'}No{'"'} untuk mengakhiri transaksi
                </>,
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini mungkin memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        },
        {
          name: 'Ibanking',
          steps: [
            {
              name: 'Langkah 1: Masuk ke akun anda',
              step: [
                <>
                  Login ke KlikBCA Individual (
                  <a
                    href='https://ibank.klikbca.com'
                    target='_blank'
                    className='font-semibold text-primary-main'
                    rel='noreferrer'
                  >
                    https://ibank.klikbca.com
                  </a>
                  )
                </>,
                <>
                  Pilih {'"'}Transfer{'"'}, lalu pilih {'"'}Transfer ke BCA Virtual Account{'"'}
                </>
              ]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>
                  Masukkan Nomor Virtual Account <strong className='text-primary-main'>{accountNumber}</strong>
                </>,
                <>
                  Pilih {'"'}Lanjutkan{'"'} untuk melanjutkan pembayaran anda
                </>,
                <>
                  Masukkan {'"'}RESPON KEYBCA APPLI 1{'"'} yang tertera di Token BCA Anda, lalu klik tombol {'"'}Kirim
                  {'"'}
                </>,
                <>Masukkan kode token autentikasi</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini mungkin memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        },
        {
          name: 'Mbanking',
          steps: [
            {
              name: 'Langkah 1: Masuk ke akun anda',
              step: [
                <>Buka Aplikasi BCA Mobile</>,
                <>
                  Pilih {'"'}m-BCA{'"'}, lalu pilih {'"'}m-Transfer{'"'}
                </>
              ]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>
                  Select {'"'}m-BCA{'"'}, then select {'"'}m-Transfer{'"'}
                </>,
                <>
                  Masukkan Nomor Virtual Account anda <strong className='text-primary-main'>{accountNumber}</strong>,
                  lalu tekan {'"'}OK{'"'}
                </>,
                <>
                  Klik tombol {'"'}Kirim{'"'} di sudut kanan atas untuk melanjutkan
                </>,
                <>
                  Klik {'"'}OK{'"'} untuk melanjutkan
                </>,
                <>Masukkan PIN anda untuk mengotorisasi transaksi</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini mungkin memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        }
      ]
    },
    {
      bank_code: 'BNI',
      note: [
        {
          name: 'ATM',
          steps: [
            {
              name: 'Langkah 1: Temukan Atm Terdekat',
              step: [<>Masukkan Kartu ATM anda</>, <>Pilih bahasa pilihan anda</>, <>Masukkan PIN ATM anda</>]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>
                  Pilih {'"'}Transaksi Lainnya{'"'}
                </>,
                <>
                  Pilih {'"'}Transfer{'"'}
                </>,
                <>Pilih jenis rekening yang anda gunakan untuk mentransfer (yaitu dari rekening Tabungan)</>,
                <>
                  Pilih {'"'}Penagihan Akun Virtual{'"'}
                </>,
                <>
                  Masukkan nomor akun virtual <strong className='text-primary-main'>{accountNumber}</strong>
                </>,
                <>Jumlah tagihan akan ditampilkan di layar</>,
                <>Konfirmasi transaksi, jika sudah benar maka lanjutkan</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>Transaksi anda selesai</>,
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini bisa memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        },
        {
          name: 'Ibanking',
          steps: [
            {
              name: 'Langkah 1: Masuk ke akun anda',
              step: [
                <>
                  Masukkan alamat berikut{' '}
                  <a
                    href='https://ibank.bni.co.id'
                    target='_blank'
                    className='font-semibold text-primary-main'
                    rel='noreferrer'
                  >
                    https://ibank.bni.co.id
                  </a>{' '}
                  dan klik \{'"'}Enter\{'"'}
                </>,
                <>Masukkan ID Pengguna dan Kata Sandi anda</>
              ]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>
                  Pilih menu {'"'}Transfer{'"'}
                </>,
                <>
                  Pilih menu {'"'}Tagihan Virtual Account{'"'}
                </>,
                <>
                  Masukkan nomor Virtual Account anda <strong className='text-primary-main'>{accountNumber}</strong>
                </>,
                <>
                  Pilih jenis akun yang anda gunakan untuk mentransfer dan tekan
                  {'"'}Lanjutkan{'"'}
                </>,
                <>Jumlah tagihan akan ditampilkan di layar</>,
                <>Masukkan kode token autentikasi</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>Transaksi anda selesai</>,
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini bisa memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        },
        {
          name: 'Mbanking',
          steps: [
            {
              name: 'Langkah 1: Masuk ke akun anda',
              step: [
                <>Masukkan ID Pengguna dan Kata Sandi anda</>,
                <>
                  Pilih menu {'"'}Transfer{'"'}
                </>
              ]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>Pilih menu “Virtual Account Billing” lalu pilih akun debet</>,
                <>
                  Masukkan Nomor Virtual Account anda <strong className='text-primary-main'>{accountNumber}</strong> di
                  menu {'"'}Masukkan Baru{'"'}
                </>,
                <>Jumlah tagihan akan ditampilkan di layar</>,
                <>Konfirmasi transaksi dan masukkan kata sandi anda</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>Transaksi anda selesai</>,
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini bisa memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        }
      ]
    },
    {
      bank_code: 'BSI',
      note: [
        {
          name: 'ATM',
          steps: [
            {
              name: 'Langkah 1: Temukan Atm Terdekat',
              step: [<>Masukkan kartu ATM dan PIN BSI anda</>, <>Masukkan PIN ATM anda</>]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>
                  Pilih {'"'}Transaksi Lainnya{'"'}
                </>,
                <>
                  Pilih {'"'}Transfer{'"'}
                </>,
                <>
                  Masukkan kode BSI VA Nomor Virtual Account{' '}
                  <strong className='text-primary-main'>{accountNumber}</strong>
                </>,
                <>Detail yang ditampilkan: NIM, Nama, & Total Tagihan</>,
                <>Konfirmasi detail transaksi anda ditampilkan</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>Transaksi anda selesai</>,
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini mungkin memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        },
        {
          name: 'Ibanking',
          steps: [
            {
              name: 'Langkah 1: Masuk ke akun anda',
              step: [
                <>
                  Buka{' '}
                  <a
                    href='https://bsinet.bankbsi.co.id'
                    target='_blank'
                    className='font-semibold text-primary-main'
                    rel='noreferrer'
                  >
                    https://bsinet.bankbsi.co.id
                  </a>
                </>,
                <>Masukkan ID Pengguna dan Kata Sandi</>
              ]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>
                  Pilih {'"'}Pembayaran{'"'}
                </>,
                <>Pilih sumber pembayaran anda</>,
                <>
                  Pilih {'"'}Institusi{'"'}
                </>,
                <>Masukkan Xendit sebagai nama institusi (kode 9347)</>,
                <>
                  Masukkan Nomor Virtual Account <strong className='text-primary-main'>{accountNumber}</strong>
                </>,
                <>Periksa informasi detail anda dan lanjutkan</>,
                <>Masukkan token transaksi</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>Transaksi anda selesai</>,
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini bisa memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        },
        {
          name: 'Mbanking',
          steps: [
            {
              name: 'Langkah 1: Masuk ke akun anda',
              step: [<>Buka aplikasi BSI Mobile</>, <>Masukkan ID Pengguna dan Kata Sandi</>]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>
                  Pilih {'"'}Pembayaran{'"'}
                </>,
                <>Pilih sumber pembayaran anda</>,
                <>
                  Pilih {'"'}Institusi{'"'}
                </>,
                <>Masukkan Xendit sebagai nama institusi (kode 9347)</>,
                <>
                  Masukkan Nomor Virtual Account <strong className='text-primary-main'>{accountNumber}</strong>
                </>,
                <>Periksa informasi detail anda dan lanjutkan</>,
                <>Masukkan token transaksi</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>Transaksi anda selesai</>,
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini mungkin memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        },
        {
          name: 'Interbank',
          steps: [
            {
              name: 'Langkah 1: Masuk ke akun anda',
              step: [<>Buka aplikasi Seluler bank anda</>, <>Masukkan ID Pengguna dan Kata Sandi</>]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>
                  Pilih {'"'}Transfer{'"'}
                </>,
                <>
                  Pilih {'"'}Interbank{'"'}
                </>,
                <>
                  Masukkan Kode BSI VA <strong className='text-primary-main'>900</strong> + Nomor Rekening Virtual{' '}
                  <strong className='text-primary-main'>{accountNumber}</strong> Catatan: Untuk antar bank melalui ATM,
                  anda perlu mencantumkan Kode Bank BSI {'"'}451{'"'} sebelum Kode BSI VA {'"'}900{'"'}
                </>,
                <>Masukkan nominal yang harus anda bayar</>,
                <>Pilih jenis akun</>,
                <>Konfirmasi detail transaksi anda ditampilkan</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>Transaksi anda selesai</>,
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini mungkin memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        }
      ]
    },
    {
      bank_code: 'MANDIRI',
      note: [
        {
          name: 'Mbanking Yellow Livin App',
          steps: [
            {
              name: 'Langkah 1: Masuk ke akun anda',
              step: [
                <>Buka Livin by Mandiri, lalu masukkan PASSWORD atau lakukan verifikasi wajah</>,
                <>
                  Pilih {'"'}Payment{'"'}
                </>,
                <>
                  Cari {'"'}Xendit 88908{'"'}
                </>
              ]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>
                  Pilih {'"'}Xendit 88908{'"'} sebagai penyedia layanan
                </>,
                <>
                  Masukkan Nomor Virtual Account anda <strong className='text-primary-main'>{accountNumber}</strong>
                </>,
                <>Nominal yang akan ditransfer akan otomatis terisi</>,
                <>Tinjau dan konfirmasi detail transaksi</>,
                <>Selesaikan transaksi dengan memasukkan MPIN anda</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>Setelah pembayaran berhasil, simpan struk transaksi atau screenshot layar sebagai bukti pembayaran</>,
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini mungkin memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        },
        {
          name: 'ATM',
          steps: [
            {
              name: 'Langkah 1: Temukan Atm Terdekat',
              step: [
                <>
                  Masukkan kartu ATM anda dan pilih {'"'}Bahasa Inggris{'"'}
                </>,
                <>
                  Masukkan PIN, lalu pilih {'"'}MASUKKAN{'"'}
                </>,
                <>
                  Pilih {'"'}PEMBAYARAN{'"'}, lalu pilih {'"'}MULTI PEMBAYARAN
                  {'"'}
                </>
              ]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>
                  Masukkan kode perusahaan {'"'}88908{'"'} (88908 XENDIT), lalu tekan
                  {'"'}BENAR{'"'}
                </>,
                <>
                  Masukkan Nomor Virtual Account <strong className='text-primary-main'>{accountNumber}</strong>, lalu
                  tekan {'"'}BENAR{'"'}
                </>,
                <>
                  Masukkan jumlah yang akan ditransfer, lalu tekan {'"'}BENAR
                  {'"'}
                </>,
                <>
                  Detail merchant akan ditampilkan, pilih nomor 1 sesuai dengan jumlah tagihan dan lalu tekan {'"'}YA
                  {'"'}
                </>,
                <>
                  Konfirmasi pembayaran akan ditampilkan. Pilih {'"'}YA{'"'}, untuk melanjutkan
                </>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>Simpan tanda terima anda sebagai bukti pembayaran</>,
                <>Transaksi anda berhasil</>,
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini mungkin memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        },
        {
          name: 'Ibanking',
          steps: [
            {
              name: 'Langkah 1: Masuk ke akun anda',
              step: [
                <>
                  Masuk ke website Mandiri Internet Banking{' '}
                  <a
                    href='https://ibank.bankmandiri.co.id'
                    target='_blank'
                    className='font-semibold text-primary-main'
                    rel='noreferrer'
                  >
                    https://ibank.bankmandiri.co.id
                  </a>
                </>,
                <>Login dengan USER ID dan PASSWORD anda</>,
                <>
                  Buka halaman Beranda, lalu pilih {'"'}Pembayaran{'"'}
                </>,
                <>
                  Pilih {'"'}Multi Pembayaran{'"'}
                </>
              ]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>Pilih 88908 XENDIT sebagai penyedia layanan</>,
                <>
                  Masukkan Nomor Virtual Account anda <strong className='text-primary-main'>{accountNumber}</strong>
                </>,
                <>Tekan lanjutkan</>,
                <>
                  Jika semua detail sudah benar lalu klik {'"'}KONFIRMASI{'"'}
                </>,
                <>Masukkan PIN / Challenge Code Token</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>Setelah pembayaran berhasil, simpan struk transaksi atau screenshot layar sebagai bukti pembayaran</>,
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini mungkin memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        }
      ]
    },
    {
      bank_code: 'PERMATA',
      note: [
        {
          name: 'ATM',
          steps: [
            {
              name: 'Langkah 1: Temukan Atm Terdekat',
              step: [<>Masukkan kartu ATM Permata dan PIN anda</>, <>Masukkan PIN ATM anda</>]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>
                  Pilih Menu {'"'}Transaksi Lainnya{'"'}
                </>,
                <>
                  Pilih {'"'}Transfer{'"'}
                </>,
                <>
                  Pilih {'"'}Transfer Antar Rekening Permata Bank{'"'}
                </>,
                <>
                  Pilih {'"'}Penagihan Akun Virtual{'"'}
                </>,
                <>
                  Masukkan Nomor Virtual Account <strong className='text-primary-main'>{accountNumber}</strong>
                </>,
                <>Pilih jenis rekening yang anda gunakan untuk mentransfer (yaitu dari rekening Tabungan)</>,
                <>Konfirmasi detail transaksi anda ditampilkan</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini mungkin memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        },
        {
          name: 'Ibanking',
          steps: [
            {
              name: 'Langkah 1: Masuk ke akun anda',
              step: [
                <>
                  Membuka{' '}
                  <a
                    href='https://new.permatanet.com'
                    target='_blank'
                    className='font-semibold text-primary-main'
                    rel='noreferrer'
                  >
                    https://new.permatanet.com
                  </a>{' '}
                  dan masuk
                </>
              ]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>
                  Pilih {'"'}Pembayaran{'"'}
                </>,
                <>
                  Pilih {'"'}Pembayaran Tagihan{'"'}
                </>,
                <>
                  Pilih {'"'}Virtual Account{'"'}
                </>,
                <>Pilih sumber pembayaran anda</>,
                <>
                  Pilih {'"'}Masukkan Daftar Tagihan Baru{'"'}
                </>,
                <>
                  Masukkan nomor Virtual Account anda <strong className='text-primary-main'>{accountNumber}</strong>
                </>,
                <>Periksa informasi detail anda dan lanjutkan</>,
                <>Masukkan kode respons token SMS</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>Transaksi anda selesai</>,
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini bisa memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        },
        {
          name: 'Mbanking',
          steps: [
            {
              name: 'Langkah 1: Masuk ke akun anda',
              step: [
                <>Buka Aplikasi Permata</>,
                <>
                  Pilih {'"'}Transfer{'"'}
                </>
              ]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>
                  Select {'"'}Rekening PermataBank{'"'}
                </>,
                <>
                  Masukkan Nomor Virtual Account anda <strong className='text-primary-main'>{accountNumber}</strong>
                </>,
                <>Masukkan token autentikasi</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>Transaksi anda selesai</>,
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini bisa memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        }
      ]
    },
    {
      bank_code: 'BJB',
      note: [
        {
          name: 'ATM',
          steps: [
            {
              name: 'Langkah 1: Temukan Atm Terdekat',
              step: [<>Masukkan kartu ATM dan PIN BJB Anda</>, <>Masukkan PIN ATM anda</>]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>
                  Pilih Menu {'"'}Transaksi Lainnya{'"'}
                </>,
                <>
                  Pilih {'"'}Akun Virtual{'"'}
                </>,
                <>Pilih jenis rekening yang anda gunakan untuk mentransfer (yaitu dari rekening Tabungan)</>,
                <>
                  Masukkan Nomor Virtual Account <strong className='text-primary-main'>{accountNumber}</strong>
                </>,
                <>Konfirmasi detail transaksi anda ditampilkan</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini mungkin memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        },
        {
          name: 'Ibanking',
          steps: [
            {
              name: 'Langkah 1: Masuk ke akun anda',
              step: [
                <>
                  Buka{' '}
                  <a
                    href='https://ib.bankbjb.co.id/bjb.net'
                    target='_blank'
                    className='font-semibold text-primary-main'
                    rel='noreferrer'
                  >
                    https://ib.bankbjb.co.id/bjb.net
                  </a>
                </>,
                <>Masukkan ID Pengguna dan Kata Sandi</>
              ]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>
                  Pilih {'"'}Akun Virtual{'"'}
                </>,
                <>Pilih jenis rekening yang anda gunakan untuk mentransfer (yaitu dari rekening Tabungan)</>,
                <>
                  Masukkan Nomor Virtual Account <strong className='text-primary-main'>{accountNumber}</strong>
                </>,
                <>Konfirmasi detail transaksi anda ditampilkan</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>Transaksi anda selesai</>,
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini bisa memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        },
        {
          name: 'Mbanking',
          steps: [
            {
              name: 'Langkah 1: Masuk ke akun anda',
              step: [<>Buka aplikasi BJB Mobile</>, <>Masukkan ID Pengguna dan Kata Sandi</>]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>
                  Pilih {'"'}Virtual Account{'"'}
                </>,
                <>Pilih jenis rekening yang anda gunakan untuk mentransfer (yaitu dari rekening Tabungan)</>,
                <>
                  Pilih {'"'}Institusi{'"'}
                </>,
                <>Masukkan Xendit sebagai nama institusi (kode 9347)</>,
                <>
                  Masukkan Nomor Virtual Account <strong className='text-primary-main'>{accountNumber}</strong>
                </>,
                <>Konfirmasi detail transaksi anda ditampilkan</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>Transaksi anda selesai</>,
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini bisa memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        }
      ]
    },
    {
      bank_code: 'SAHABAT_SAMPOERNA',
      note: [
        {
          name: 'ATM',
          steps: [
            {
              name: 'Langkah 1: Temukan Atm Terdekat',
              step: [<>Masukkan kartu ATM dan PIN anda</>, <>Masukkan PIN ATM anda</>]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>Pilih menu TRANSAKSI LAIN → TRANSFER → TRANSFER KE BANK LAIN</>,
                <>Kode input BANK SAHABAT SAMPOERNA adalah 523 → Pilih YA</>,
                <>
                  Masukkan 16 digit nomor virtual account <strong className='text-primary-main'>{accountNumber}</strong>
                </>,
                <>Masukkan jumlah pembayaran</>,
                <>Periksa kembali transaksi anda, lalu pilih YA untuk melanjutkan</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini mungkin memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        },
        {
          name: 'Ibanking',
          steps: [
            {
              name: 'Langkah 1: Masuk ke akun anda',
              step: [
                <>
                  Login akun Internet Banking anda{' '}
                  <a
                    href='https://ibank.banksampoerna.co.id/ibi/login'
                    target='_blank'
                    className='font-semibold text-primary-main'
                    rel='noreferrer'
                  >
                    https://ibank.banksampoerna.co.id/ibi/login
                  </a>
                </>,
                <>Masukkan ID Pengguna dan Kata Sandi</>
              ]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>
                  Pilih {'"'}Akun Virtual{'"'}
                </>,
                <>Pilih menu TRANSFER DANA → TRANSFER KE BANK SAHABAT SAMPOERNA</>,
                <>
                  Masukkan 16 digit nomor virtual account <strong className='text-primary-main'>{accountNumber}</strong>
                </>,
                <>Masukkan jumlah pembayaran</>,
                <>Masukkan token i-Banking anda</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>Transaksi anda selesai</>,
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini bisa memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        },
        {
          name: 'Mbanking',
          steps: [
            {
              name: 'Langkah 1: Masuk ke akun anda',
              step: [<>Login akun Mobile Banking anda dari ponsel anda</>, <>Masukkan ID Pengguna dan Kata Sandi</>]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>Pilih menu TRANSFER DANA → TRANSFER KE ANTAR BANK</>,
                <>Kode input BANK SAHABAT SAMPOERNA adalah 523 → Pilih YA</>,
                <>
                  Masukkan 16 digit nomor virtual account <strong className='text-primary-main'>{accountNumber}</strong>
                </>,
                <>Masukkan jumlah pembayaran</>,
                <>Masukkan token M-Banking anda</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [
                <>Transaksi anda selesai</>,
                <>
                  Setelah transaksi pembayaran selesai, invoice ini akan diperbarui secara otomatis. Ini bisa memakan
                  waktu hingga 5 menit
                </>
              ]
            }
          ]
        }
      ]
    },
    {
      bank_code: 'CIMB',
      note: [
        {
          name: 'ATM',
          steps: [
            {
              name: 'Langkah 1: Temukan Atm Terdekat',
              step: [<>Masukkan Kartu ATM</>, <>Masukkan PIN CIMB Toppers</>]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>Pilih menu Pembayaran &gt; Lanjut &gt; Virtual Account</>,
                <>
                  Masukkan nomor virtual account <strong className='text-primary-main'>{accountNumber}</strong>
                </>,
                <>Pilih rekening debit</>,
                <>Nomor, nama virtual account dan jumlah billing ditampilkan pada layar</>,
                <>Pilih OK untuk melakukan pembayaran</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [<>Konfirmasi pembayaran ditampilkan pada layar</>]
            }
          ]
        },
        {
          name: 'ATM Bersama / Prima',
          steps: [
            {
              name: 'Langkah 1: Temukan Atm Terdekat',
              step: [<>Masukkan Kartu ATM</>, <>PIN kamu pada mesin ATM bank tersebut</>]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>Pilih menu TRANSFER &gt; TRANSFER KE BANK LAIN</>,
                <>Masukkan kode bank CIMB Niaga: 022</>,
                <>Masukkan jumlah pembayaran sesuai tagihan</>,
                <>
                  Masukkan nomor virtual account <strong className='text-primary-main'>{accountNumber}</strong>
                </>,
                <>Ikuti instruksi untuk menyelesaikan transaksi</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [<>Konfirmasi pembayaran ditampilkan pada layar</>]
            }
          ]
        },
        {
          name: 'Ibanking',
          steps: [
            {
              name: 'Langkah 1: Masuk ke akun anda',
              step: [
                <>
                  Login ke{' '}
                  <a
                    href='https://www.octoclicks.co.id'
                    target='_blank'
                    className='font-semibold text-primary-main'
                    rel='noreferrer'
                  >
                    https://www.octoclicks.co.id
                  </a>
                </>
              ]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>Pilih menu Bayar Tagihan / Pay Bills</>,
                <>Pilih Rekening Sumber / Source Account dan Jenis Pembayaran / Payment Type &gt; Virtual Account</>,
                <>
                  Masukkan nomor virtual account <strong className='text-primary-main'>{accountNumber}</strong>
                </>,
                <>Nomor, nama virtual account dan jumlah billing ditampilkan pada layar</>,
                <>Masukkan 6 digit mPIN dan tekan tombol Submit</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [<>Konfirmasi pembayaran ditampilkan pada layar</>]
            }
          ]
        },
        {
          name: 'Ibanking Lain',
          steps: [
            {
              name: 'Langkah 1: Masuk ke akun anda',
              step: [<>Login ke internet banking</>, <>Pilih menu transfer ke Bank Lain Online</>]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>Pilih bank tujuan Bank CIMB Niaga (kode bank: 022)</>,
                <>
                  Masukkan nomor virtual account <strong className='text-primary-main'>{accountNumber}</strong>
                </>,
                <>Masukkan jumlah pembayaran sesuai tagihan</>,
                <>Nomor, nama virtual account dan jumlah billing ditampilkan pada layar</>,
                <>Ikuti instruksi untuk menyelesaikan transaksi</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [<>Konfirmasi pembayaran ditampilkan pada layar</>]
            }
          ]
        },
        {
          name: 'Mbanking',
          steps: [
            {
              name: 'Langkah 1: Masuk ke akun anda',
              step: [<>Login ke Go Mobile</>]
            },
            {
              name: 'Langkah 2: Rincian Pembayaran',
              step: [
                <>
                  Pilih menu {'"'}TRANSFER{'"'}
                </>,
                <>
                  Pilih {'"'}Transfer to Other CIMB Niaga Account{'"'}
                </>,
                <>Pilih rekening sumber Anda: CASA atau Rekening Ponsel</>,
                <>
                  Pilih CASA dan masukkan nomor virtual account{' '}
                  <strong className='text-primary-main'>{accountNumber}</strong>
                </>,
                <>Masukkan jumlah pembayaran sesuai tagihan</>,
                <>Masukkan Mobile Banking PIN</>
              ]
            },
            {
              name: 'Langkah 3: Transaksi Selesai',
              step: [<>Konfirmasi pembayaran ditampilkan pada layar</>]
            }
          ]
        }
      ]
    }
  ]

  return banks
}

export const PERIODE_AJARAN = {
  thnAjaran: ['2025/2026', '2024/2025', '2023/2024', '2022/2023', '2021/2022', '2020/2021', '2019/2020', '2018/2019'],
  semester: ['GANJIL', 'PENDEK', 'GENAP']
}

export const WINDOW_USER_SCRIPT_VARIABLE = 'td'

export const SEMESTER = [
  { id: 1, title: 'Semester 1' },
  { id: 2, title: 'Semester 2' },
  { id: 3, title: 'Semester 3' },
  { id: 4, title: 'Semester 4' },
  { id: 5, title: 'Semester 5' },
  { id: 6, title: 'Semester 6' }
]

export const PRODI = [
  {
    CODE: 61201,
    code: 'MANAJEMEN',
    value: 'MANAJEMEN',
    label: 'Manajemen',
    konsentrasi: [
      // {
      //   value: 'BISNIS',
      //   feeder: 'Manaj.Pengb.Bisnis',
      //   label: 'Pengembangan Bisnis'
      // },
      {
        code: 'SDM',
        value: 'SDM',
        feeder: 'Manj.SDM',
        label: 'Manajemen SDM'
      },
      {
        code: 'KEUANGAN',
        value: 'KEUANGAN',
        feeder: 'Manaj.Keuangan',
        label: 'Manajemen Keuangan'
      },
      {
        code: 'PEMASARAN',
        value: 'PEMASARAN',
        feeder: 'Manaj.Pemasaran',
        label: 'Manajemen Pemasaran'
      }
    ]
  }
]

export const JENJANG_PENDIDIKAN = 'STRATA SATU (S.1)'

export const StudentClassStatus = ['active', 'passed']
export const StudentClassType = ['ONLINE', 'REGULER']
export const ClassType = ['REGULER', 'KONSENTRASI']
export const CourseType = ['WAJIB', 'KONSENTRASI', 'PILIHAN', 'TUGAS AKHIR/ SKRIPSI/ THESIS/ DISERTASI']
export const CourseStatus = ['Active', 'InActive', 'Transferred']

export const REGISTRATION = ['KIP', 'LEMBAGA', 'SUBSIDI']

export const STUDENT_STATUS = [
  { label: 'Aktif', value: 'active' },
  { label: 'Tidak Aktif', value: 'inactive' },
  { label: 'Lulus', value: 'graduated' },
  { label: 'DO', value: 'DO' }
]

export const BIODATA = {
  gender: [
    { value: 'male', label: 'Laki-Laki' },
    { value: 'female', label: 'Perempuan' }
  ],
  religion: [
    { value: 'islam', label: 'Islam' },
    { value: 'kristen', label: 'Kristen' },
    { value: 'katholik', label: 'Katholik' },
    { value: 'hindu', label: 'Hindu' },
    { value: 'budha', label: 'Budha' },
    { value: 'konghucu', label: 'Konghucu' },
    { value: 'other', label: 'Lainnya...' }
  ],
  kewarganegaraan: [{ value: 'indonesia', label: 'Indonesia' }]
}

export const DAYS_NAME = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU']
export const DAYS_OF_WEEK = [
  { value: 'sunday', label: 'Minggu' },
  { value: 'monday', label: 'Senin' },
  { value: 'tuesday', label: 'Selasa' },
  { value: 'wednesday', label: 'Rabu' },
  { value: 'thursday', label: 'Kamis' },
  { value: 'friday', label: 'Jumat' },
  { value: 'saturday', label: 'Sabtu' }
]

export const STUDENT_TYPE = [
  { name: 'Eksekutif', value: 'ONLINE' },
  { name: 'Reguler', value: 'OFFLINE' }
]
