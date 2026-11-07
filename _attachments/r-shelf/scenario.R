# The shelf scenario: data frames and the `book` S3 class shared by every page.
# Usage: save this file, books.csv and loans.csv in your working directory,
# then run source("scenario.R"). Set the SHELF_DIR environment variable to
# read the two CSV files from another directory.

shelf_dir <- Sys.getenv("SHELF_DIR", unset = ".")
shelf_today <- as.Date("2026-06-30")
loan_days <- 21L

# --- data frames ----------------------------------------------------------

books <- read.csv(file.path(shelf_dir, "books.csv"))

loans <- read.csv(file.path(shelf_dir, "loans.csv"), colClasses = "character")
loans$loan_date <- as.Date(loans$loan_date, format = "%Y-%m-%d")
loans$return_date <- as.Date(loans$return_date, format = "%Y-%m-%d")

# --- the book S3 class ----------------------------------------------------

normalise_isbn <- function(x) {
  gsub("[^0-9X]", "", toupper(x))
}

is_valid_isbn13 <- function(x) {
  digits <- normalise_isbn(x)
  ok <- nchar(digits) == 13L & !grepl("X", digits, fixed = TRUE)
  vapply(seq_along(digits), \(i) {
    if (!ok[[i]]) {
      return(FALSE)
    }
    d <- as.integer(strsplit(digits[[i]], "")[[1L]])
    sum(d * rep(c(1L, 3L), length.out = 13L)) %% 10L == 0L
  }, logical(1L))
}

new_book <- function(title = character(), author = character(),
                     isbn = character(), year = integer(),
                     genre = character(), pages = integer()) {
  stopifnot(
    is.character(title), is.character(author), is.character(isbn),
    is.integer(year), is.character(genre), is.integer(pages)
  )
  structure(
    list(
      title = title, author = author, isbn = isbn,
      year = year, genre = genre, pages = pages
    ),
    class = "book"
  )
}

validate_book <- function(x) {
  fields <- unclass(x)
  if (any(lengths(fields) != 1L)) {
    stop("every field of a book must have length 1", call. = FALSE)
  }
  if (is.na(fields$title) || !nzchar(fields$title)) {
    stop("a book needs a title", call. = FALSE)
  }
  if (!is.na(fields$isbn) && !is_valid_isbn13(fields$isbn)) {
    stop("invalid ISBN-13: ", fields$isbn, call. = FALSE)
  }
  if (!is.na(fields$year) && fields$year > 2100L) {
    stop("implausible year: ", fields$year, call. = FALSE)
  }
  x
}

book <- function(title, author = NA_character_, isbn = NA_character_,
                 year = NA_integer_, genre = NA_character_,
                 pages = NA_integer_) {
  validate_book(new_book(
    title = trimws(title),
    author = trimws(author),
    isbn = if (is.na(isbn)) isbn else normalise_isbn(isbn),
    year = as.integer(year),
    genre = trimws(genre),
    pages = as.integer(pages)
  ))
}

format.book <- function(x, ...) {
  year <- if (is.na(x$year)) "n.d." else x$year
  sprintf("%s (%s, %s)", x$title, x$author, year)
}

print.book <- function(x, ...) {
  cat("<book>", format(x), "\n")
  invisible(x)
}

summary.book <- function(object, ...) {
  structure(
    list(
      title = object$title,
      has_isbn = !is.na(object$isbn),
      pages = object$pages
    ),
    class = "summary.book"
  )
}

print.summary.book <- function(x, ...) {
  cat("Book:", x$title, "\n")
  cat("ISBN known:", x$has_isbn, "\n")
  cat("Pages:", if (is.na(x$pages)) "unknown" else x$pages, "\n")
  invisible(x)
}
