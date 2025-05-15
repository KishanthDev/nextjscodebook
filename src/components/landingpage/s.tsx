{/* <div className="mb-8 md:mb-16 flex flex-col lg:flex-row gap-2 items-center">
          <div className="relative max-w-[384px] lg:max-w-[320px] w-full">
            <div className="lg:hidden pb-8 sm:pb-0 pr-4">
              <Image
                className="rounded-3xl ml-0"
                src="/landingpage/service.webp"
                alt="Quote from Sephora about using live chat software for customer service"
                width={416}
                height={256}
                priority={false}
                style={{ maxWidth: '416px' }}
              />
            </div>
            <div className="hidden lg:block">
              <Image
                className="rounded-3xl ml-0"
                src="/landingpage/service.webp"
                alt="Quote from Sephora about using live chat software for customer service"
                width={352}
                height={308}
                priority={false}
                style={{ maxWidth: '352px' }}
              />
            </div>
            <div
              className="absolute flex max-w-[192px] px-3 py-2 rounded-2xl border border-green-100"
              style={{
                bottom: 0,
                right: 0,
                background: 'rgba(209, 244, 213, 0.80)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                height: '130px',
              }}
            >
              <p className="text-sm m-0 self-center">
                <strong>25%</strong> increase in <strong>average order value</strong>{' '}
                after implementing LiveChat®
              </p>
            </div>
          </div>
          <blockquote className="flex flex-col lg:flex-row justify-between items-center gap-2 max-w-[448px]">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mb-1 md:mb-4"
                width="154"
                height="40"
                fill="none"
              >
                <path
                  fill="#1B1B20"
                  d="M76 18.2h-9v-6.8h-2.7v17.3h2.8v-8.2h9v8.2h2.6V11.4h-2.6m-26.6 0-4.8-.1v17.4h2.8V22h3.2c1.6-.1 5.8-1 5.8-5.7 0-5.4-6-5-7-5Zm-.1 8.4h-1.9v-6.3h1.6c.7 0 5-.3 5 3 .2 3.1-3.1 3.3-4.7 3.3ZM24 11.3v17.4h11v-2.3H27v-5.9h5.9v-2.1h-6v-4.8h8.4v-2.3H24Zm-16 4.2c0-2.8 3.7-3 6-1l.8-2.4C8.4 9 5.4 13 5.4 15.7c0 6.3 9 5 7.7 9.4-.5 1.6-3.4 2.5-6.7.5l-1 2.3c4.4 2.3 10.1 1.2 10.3-3.5.3-6-7.7-5.5-7.7-8.9Zm116 .7c-.3-5.2-5.4-4.8-6.5-4.8l-4.6-.1v17.4h2.7v-7.3l2.7-.1 5 7.4h3.3l-5.5-7.9c1.5-.5 3.2-1.7 3-4.6Zm-6.7 3.1h-1.7v-5.9h1.5c.7 0 4.3-.2 4.6 2.7.4 3.3-3.6 3.2-4.4 3.2Zm25-8h-3.2l-5.8 17.4h2.7l1.2-4h7.1l1.4 4h2.9l-6.4-17.4Zm-4.5 11.4 2.8-8.6 3 8.6h-5.8Zm-42-11.9a9 9 0 0 0-9.3 9.2 9 9 0 0 0 9.2 9.2 9 9 0 0 0 9.3-9.2 9 9 0 0 0-9.3-9.2Zm0 15.9c-4.2 0-6.5-3-6.5-6.7s2.3-6.7 6.4-6.7c4.1 0 6.5 3 6.5 6.7s-2.4 6.7-6.5 6.7Z"
                />
              </svg>
              <p className="text-lg font-bold" style={{ lineHeight: 1.3 }}>
                “Most of our chats are sales-related, and we’ve seen a significant
                uptick in sales since implementing LiveChat®. By offering quick online
                consultations, customers on the fence can get the advice they need to
                confidently choose and buy.”
              </p>
              <div className="flex md:items-end justify-between gap-1">
                <cite
                  className="text-sm"
                  style={{ bottom: '1.5rem', left: '1.5rem', fontStyle: 'normal' }}
                >
                  <b>Milena Wojewoda</b>, Digital Project Specialist at Sephora
                </cite>
                <Link
                  href="/customers/customer-stories/sephora/"
                  aria-label="Read the Sephora case study"
                  target="_blank"
                  className="p-1 rounded-full flex items-center justify-center border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
                  style={{ width: '3rem', height: '3rem', flexShrink: 0 }}
                  data-controller="events"
                  data-events-event="box"
                  data-events-content1="Sephora"
                  data-events-content2="Read case study"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_2_2093)">
                      <path
                        d="M10 6L16 12L10 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2_2093">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </Link>
              </div>
            </div>
          </blockquote>
        </div>
        <div
          data-controller="attribute logged-in"
          data-attribute-add-class="hidden"
          data-action="logged-in:loggedIn->attribute#removeClass"
        >
          <div className="flex md:hidden flex-col items-center justify-center mt-3 text-center gap-4">
            <h3 className="text-lg my-0 font-medium">
              Sell more products with live chat online
            </h3>
            <Link
              href="https://accounts.livechat.com/signup?source_id=engage_section_ending_cta&source_url=https%3A%2F%2Fwww.livechat.com&source_type=website&utm_source=PP&utm_medium=link&utm_campaign=pp_10off&utm_term=1-g-Cj0KCQjw8cHABhC-ARIsAJnY12xUzSCGtPx1EeNvnYNy0DYue-7gCrv_0Mq0wBrVEV6KrZ7bgPtsOowaAtUhEALw_wcB&landing_page=https%3A%2F%2Fwww.livechat.com%2F&partner_id=PVDCS9SU0D"
              className="w-full bg-black text-white rounded-lg py-2 px-4 hover:bg-gray-800 transition-colors"
              data-controller="events"
              data-events-event="button register_redirect"
              data-events-content2="Sign up free"
              data-events-source-id="engage_section_ending_cta"
            >
              Sign up free
            </Link>
          </div>
          <div className="hidden md:flex flex-row items-center justify-center bg-white rounded-2xl border border-black/40 mt-3 p-1.5 text-center hover:shadow-lg transition-shadow gap-8">
            <h3 className="text-lg my-0 font-medium">
              Sell more products with live chat online
            </h3>
            <Link
              href="https://accounts.livechat.com/signup?source_id=engage_section_ending_cta&source_url=https%3A%2F%2Fwww.livechat.com&source_type=website&utm_source=PP&utm_medium=link&utm_campaign=pp_10off&utm_term=1-g-Cj0KCQjw8cHABhC-ARIsAJnY12xUzSCGtPx1EeNvnYNy0DYue-7gCrv_0Mq0wBrVEV6KrZ7bgPtsOowaAtUhEALw_wcB&landing_page=https%3A%2F%2Fwww.livechat.com%2F&partner_id=PVDCS9SU0D"
              className="bg-black text-white rounded-lg py-1 px-4 hover:bg-gray-800 transition-colors"
              data-controller="events"
              data-events-event="button register_redirect"
              data-events-content2="Sign up free"
              data-events-source-id="engage_section_ending_cta"
            >
              Sign up free
            </Link>
          </div>
        </div> */}